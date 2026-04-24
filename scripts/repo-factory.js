const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function generateDemo(data) {
    const timestamp = Date.now();
    // Convert camelCase to SNAKE_CASE for directory and ID creation
    const companyName = data.businessName || data.companyName || 'Demo Website';
    const demoId = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + timestamp;
    const workingDir = process.cwd().includes('frontend') ? path.join(process.cwd(), '..') : process.cwd();
    const targetDir = path.join(workingDir, 'demos', demoId);
    
    // Select template based on industry/layout
    let templateName = 'professional-v1';
    if (data.industry && data.industry.toLowerCase() === 'medical') templateName = 'medical-v1';
    else if (data.industry && data.industry.toLowerCase() === 'fashion') templateName = 'fashion-v1';
    // Defaults to professional-v1 for now if others don't exist

    const templateDir = path.join(workingDir, 'templates', templateName);

    console.log('Generating demo: ' + demoId + ' using template: ' + templateName);

    // 1. Create Demo Directory
    if (!fs.existsSync(path.join(workingDir, 'demos'))) {
        fs.mkdirSync(path.join(workingDir, 'demos'));
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
                
                // Replace strings
                Object.keys(data).forEach(key => {
                    const value = data[key];
                    const snakeKey = key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase();
                    const simpleUpper = key.toUpperCase();
                    
                    content = content.split(`{{${snakeKey}}}`).join(value);
                    content = content.split(`{{${simpleUpper}}}`).join(value);
                });

                // Inject floating CTA into HTML files
                if (ext === '.html') {
                    const floatingCTA = `
    <!-- AI SiteSpark Floating CTA -->
    <div style="position: fixed; bottom: 20px; right: 20px; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); border: 1px solid rgba(0,240,255,0.3); padding: 16px 24px; border-radius: 12px; z-index: 9999; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 16px; font-family: sans-serif;">
        <div style="color: white; text-align: left;">
            <p style="margin: 0; font-size: 0.8rem; color: #a1a3ab; margin-bottom: 4px;">Demo built by AI SiteSpark</p>
            <p style="margin: 0; font-size: 1rem; font-weight: 600;">Love this website?</p>
        </div>
        <a href="https://example.com/claim?demo=${demoId}" target="_blank" style="background: #00f0ff; color: #000; text-decoration: none; padding: 10px 20px; border-radius: 99px; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; box-shadow: 0 0 15px rgba(0,240,255,0.4);">Claim It Now</a>
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

    // 3. Handle Logo File Upload
    if (data.logoUrl && data.logoUrl.startsWith('data:image')) {
        const matches = data.logoUrl.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
            const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
            const buffer = Buffer.from(matches[2], 'base64');
            const assetsDir = path.join(targetDir, 'assets');
            if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
            
            const logoPath = path.join(assetsDir, `brand-logo.${ext}`);
            fs.writeFileSync(logoPath, buffer);
            console.log(`Logo saved to ${logoPath}`);
            
            // Overwrite any logo reference in text files to the new logo
            // This is a naive but effective way for the prototype
            // e.g., mapping {{LOGO_PATH}}
            data.logoPath = `assets/brand-logo.${ext}`;
        }
    }

    // 4. Deploy to GitHub (if token is provided)
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

    // 2. Initialize Git, Commit, and Push
    const remoteUrl = `https://${token}@github.com/${orgName}/${repoName}.git`;
    
    // We use execSync to run git commands in the target directory
    try {
        execSync('git init', { cwd: targetDir, stdio: 'ignore' });
        execSync('git add .', { cwd: targetDir, stdio: 'ignore' });
        execSync('git commit -m "Initial commit by AI SiteSpark"', { cwd: targetDir, stdio: 'ignore' });
        execSync('git branch -M main', { cwd: targetDir, stdio: 'ignore' });
        execSync(`git remote add origin ${remoteUrl}`, { cwd: targetDir, stdio: 'ignore' });
        execSync('git push -u origin main --force', { cwd: targetDir, stdio: 'ignore' });
    } catch (e) {
        throw new Error('Git commands failed. Is git installed and available in PATH?');
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
