const fs = require('fs');
const path = require('path');
const os = require('os');

async function generateDemo(data) {
    const timestamp = Date.now();
    const companyName = data.businessName || data.companyName || 'Demo Website';
    data.companyName = companyName; // Ensure companyName is available for template replacement
    const demoId = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + timestamp;
    
    // On Vercel, we can only write to /tmp.
    const workingDir = process.cwd();
    const targetDir = path.join(os.tmpdir(), 'demos', demoId);
    
    // Select template based on industry and style variant
    // templateStyle: 'v1' (standard), 'v2' (modern/dark), 'v3' (classic/elegant)
    const templateStyle = data.templateStyle || 'v1';
    const validStyles = ['v1', 'v2', 'v3'];
    const styleSuffix = validStyles.includes(templateStyle) ? templateStyle : 'v1';

    let templateBase = 'professional';
    const industry = (data.industry || '').toLowerCase();
    if (industry === 'medical') templateBase = 'medical';
    else if (industry === 'fashion') templateBase = 'fashion';
    else if (industry === 'portfolio' || industry === 'tech') templateBase = 'portfolio';
    else if (industry === 'education' || industry === 'school' || industry === 'college' || industry === 'university' || industry === 'academy') templateBase = 'education';
    else if (industry === 'construction' || industry === 'building materials' || industry === 'raw materials') templateBase = 'construction';
    else if (industry === 'interior' || industry === 'interior design' || industry === 'interior designer') templateBase = 'interior';
    else if (industry === 'hospital' || industry === 'doctor' || industry === 'clinic' || industry === 'healthcare') templateBase = 'hospital';
    else if (industry === 'agency' || industry === 'digital agency' || industry === 'marketing agency') templateBase = 'agency';
    else if (industry === 'ecommerce' || industry === 'online store' || industry === 'shopping') templateBase = 'ecommerce';
    else if (industry === 'dairy' || industry === 'dairy industry' || industry === 'milk') templateBase = 'dairy';
    else if (industry === 'real estate' || industry === 'realestate' || industry === 'property') templateBase = 'realestate';
    else if (industry === 'restaurant' || industry === 'food' || industry === 'cafe' || industry === 'dining') templateBase = 'restaurant';
    else if (industry === 'social service' || industry === 'ngo' || industry === 'charity' || industry === 'social') templateBase = 'socialservice';
    else if (industry === 'temple' || industry === 'devotional' || industry === 'religious' || industry === 'spiritual') templateBase = 'temple';

    const templateName = `${templateBase}-${styleSuffix}`;

    // Fallback: if the requested style doesn't exist on disk, fall back to v1
    let templateDir = path.join(workingDir, 'templates', templateName);
    if (!fs.existsSync(templateDir)) {
        console.log(`Template ${templateName} not found, falling back to ${templateBase}-v1`);
        templateDir = path.join(workingDir, 'templates', `${templateBase}-v1`);
    }

    console.log('Generating demo: ' + demoId + ' using template: ' + templateName);

    // 1. Create Demo Directory in /tmp
    if (!fs.existsSync(path.join(os.tmpdir(), 'demos'))) {
        fs.mkdirSync(path.join(os.tmpdir(), 'demos'), { recursive: true });
    }
    fs.mkdirSync(targetDir, { recursive: true });

    // 2. Recursive Copy and Replace
    function copyAndReplace(src, dest) {
        const stats = fs.statSync(src);
        if (stats.isDirectory()) {
            if (!fs.existsSync(dest)) fs.mkdirSync(dest);
            fs.readdirSync(src).forEach(file => {
                copyAndReplace(path.join(src, file), path.join(dest, file));
            });
        } else {
            // Only replace in text files
            const ext = path.extname(src).toLowerCase();
            const textExtensions = ['.html', '.css', '.js', '.json', '.md'];
            
            if (textExtensions.includes(ext)) {
                let content = fs.readFileSync(src, 'utf8');
                
                // Replace all template variables
                Object.keys(data).forEach(key => {
                    const value = data[key];
                    if (typeof value !== 'string') return; // skip objects/arrays
                    const snakeKey = key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase();
                    const simpleUpper = key.toUpperCase();
                    content = content.split(`{{${snakeKey}}}`).join(value);
                    content = content.split(`{{${simpleUpper}}}`).join(value);
                });

                // Inject palette color variables into CSS :root blocks
                const primary   = data.primaryColor   || '#1565C0';
                const secondary = data.secondaryColor || '#0097A7';
                const accent    = data.accentColor    || '#26C6DA';
                const bgTint    = data.bgTint         || '#E3F2FD';
                content = content.split('{{PRIMARY_COLOR}}').join(primary);
                content = content.split('{{SECONDARY_COLOR}}').join(secondary);
                content = content.split('{{ACCENT_COLOR}}').join(accent);
                content = content.split('{{BG_TINT}}').join(bgTint);

                // Embed logo directly as base64 to bypass CDN propagation delays
                if (ext === '.html' && data.logoUrl && data.logoUrl.startsWith('data:image')) {
                    content = content.split('assets/brand-logo.png').join(data.logoUrl);
                }

                // Inject floating CTA into HTML files
                if (ext === '.html') {
                    const floatingCTA = `
    <!-- AI SiteSpark Floating CTA -->
    <div style="position: fixed; bottom: 20px; right: 20px; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); border: 1px solid rgba(0,240,255,0.3); padding: 16px 24px; border-radius: 12px; z-index: 9999; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 16px; font-family: sans-serif;">
        <div style="color: white; text-align: left;">
            <p style="margin: 0; font-size: 0.8rem; color: #a1a3ab; margin-bottom: 4px;">Demo built by AI SiteSpark</p>
            <p style="margin: 0; font-size: 1rem; font-weight: 600;">Love this website?</p>
        </div>
        <a href="${data.baseUrl || 'https://automated-website-generator.vercel.app'}/claim?demo=${demoId}" target="_blank" style="background: #00f0ff; color: #000; text-decoration: none; padding: 10px 20px; border-radius: 99px; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; box-shadow: 0 0 15px rgba(0,240,255,0.4);">Claim It Now</a>
    </div>
</body>`;
                    content = content.replace('</body>', floatingCTA);
                }

                fs.writeFileSync(dest, content);
            } else {
                // Binary files (like images)
                fs.copyFileSync(src, dest);
            }
        }
    }

    copyAndReplace(templateDir, targetDir);

    // 3. Deploy to GitHub (if token is provided)
    let githubUrl = null;
    let pagesUrl = null;
    if (process.env.GITHUB_TOKEN) {
        const orgName = process.env.GITHUB_ORG || 'site-factory';
        try {
            console.log(`Starting GitHub Deployment to Organization: ${orgName}...`);
            const deployResult = await deployToGithub(targetDir, demoId, process.env.GITHUB_TOKEN, orgName);
            githubUrl = deployResult.repoUrl;
            pagesUrl = deployResult.pagesUrl;
        } catch (e) {
            console.error('GitHub Deployment Failed:', e.message);
        }
    }

    process.stdout.write(`DEMO_PATH:${targetDir}\n`);
    console.log('Demo generated Successfully!');
    return { targetDir, demoId, githubUrl, pagesUrl };
}

async function deployToGithub(targetDir, repoName, token, orgName) {
    // 1. Create repo on GitHub under the Organization
    const createRes = await fetch(`https://api.github.com/orgs/${orgName}/repos`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: repoName,
            description: 'Automated Demo Website generated by AI SiteSpark',
            private: false,
            auto_init: false
        })
    });

    if (!createRes.ok) {
        const err = await createRes.json();
        if (err.message !== 'name already exists on this account') {
            throw new Error(`Failed to create repo: ${err.message}`);
        }
    }

    // 2. Upload files via GitHub API (since Vercel doesn't have git installed)
    const filesToUpload = [];
    function readFilesRecursively(dir) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            if (fs.statSync(fullPath).isDirectory()) {
                readFilesRecursively(fullPath);
            } else {
                filesToUpload.push(fullPath);
            }
        }
    }
    
    readFilesRecursively(targetDir);

    for (const filePath of filesToUpload) {
        const relativePath = path.relative(targetDir, filePath).replace(/\\/g, '/');
        const contentBase64 = fs.readFileSync(filePath, { encoding: 'base64' });

        const uploadRes = await fetch(`https://api.github.com/repos/${orgName}/${repoName}/contents/${relativePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Add ${relativePath} via AI SiteSpark`,
                content: contentBase64,
                branch: 'main'
            })
        });

        if (!uploadRes.ok) {
            console.error(`Failed to upload ${relativePath}`);
        }
    }

    // 3. Enable GitHub Pages
    const pagesRes = await fetch(`https://api.github.com/repos/${orgName}/${repoName}/pages`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            source: { branch: 'main', path: '/' }
        })
    });

    if (!pagesRes.ok && pagesRes.status !== 409) { // 409 means already enabled
        const err = await pagesRes.json();
        console.warn('Failed to enable pages automatically. You may need to enable it manually.', err);
    }

    return {
        repoUrl: `https://github.com/${orgName}/${repoName}`,
        pagesUrl: `https://${orgName}.github.io/${repoName}/`
    };
}

module.exports = { generateDemo };

// Test Run (only if executed directly)
if (require.main === module) {
    const testData = {
        companyName: 'Zenith Wellness',
        primary_color: '#6366f1',
        hero_subtext: 'Premium holistic care for the modern individual.'
    };

    try {
        generateDemo(testData).then(() => console.log('Test complete'));
    } catch (err) {
        console.error('Error during generation:', err);
    }
}
