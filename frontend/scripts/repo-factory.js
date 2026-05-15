const fs = require('fs');
const path = require('path');
const os = require('os');
const { industries } = require('../templates/shared/template-data');

async function generateDemo(data) {
    const timestamp = Date.now();
    const companyName = data.businessName || data.companyName || 'Demo Website';
    data.companyName = companyName; // Ensure companyName is available for template replacement
    data.businessPhone = data.businessPhone || 'Add your phone number';
    data.businessEmail = data.businessEmail || 'hello@example.com';
    data.businessLocation = data.businessLocation || 'Add your business address';
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

                // Inject a persistent WhatsApp footer into HTML files
                if (ext === '.html') {
                    const ownerWhatsApp = (process.env.OWNER_WHATSAPP_NUMBER || '').replace(/\D/g, '');
                    const whatsappHref = ownerWhatsApp
                        ? `https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(`Hi, I want to claim the demo website for ${companyName}. Demo ID: ${demoId}`)}`
                        : `${data.baseUrl || 'https://automated-website-generator.vercel.app'}/contact`;
                    const floatingCTA = `
    <!-- AI SiteSpark Shared Template Upgrade -->
    <style>
      .aisitespark-conversion-band {
        margin: 72px auto 32px;
        max-width: 1100px;
        padding: 0 24px;
      }
      .aisitespark-conversion-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        border-radius: 20px;
        padding: 24px;
        background: linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.92));
        color: #ffffff;
        box-shadow: 0 20px 50px rgba(15,23,42,0.18);
      }
      .aisitespark-conversion-card strong { display: block; font-size: 1.15rem; margin-bottom: 6px; }
      .aisitespark-conversion-card span { display: block; color: rgba(255,255,255,0.72); line-height: 1.5; }
      .aisitespark-conversion-card a {
        flex-shrink: 0;
        text-decoration: none;
        color: #ffffff;
        background: #16a34a;
        padding: 12px 18px;
        border-radius: 999px;
        font-weight: 700;
      }
      img { max-width: 100%; height: auto; }
      @media (max-width: 640px) {
        .aisitespark-conversion-card {
          flex-direction: column;
          align-items: stretch;
        }
        .aisitespark-conversion-card a { text-align: center; }
      }
    </style>
    <section class="aisitespark-conversion-band">
      <div class="aisitespark-conversion-card">
        <div>
          <strong>Want this site launched for ${companyName}?</strong>
          <span>Move from preview to a fully owned website with hosting, domain setup, and final customisation.</span>
        </div>
        <a href="${whatsappHref}" target="_blank" rel="noopener noreferrer">Talk on WhatsApp</a>
      </div>
    </section>
    <!-- AI SiteSpark Demo Mode Footer -->
    <style>
      body { padding-bottom: 88px; }
      .aisitespark-demo-footer {
        position: fixed;
        left: 16px;
        right: 16px;
        bottom: 16px;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 14px 16px;
        border-radius: 16px;
        background: rgba(15, 23, 42, 0.92);
        color: #ffffff;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.28);
        backdrop-filter: blur(14px);
        font-family: Arial, sans-serif;
      }
      .aisitespark-demo-footer strong { display: block; font-size: 0.95rem; }
      .aisitespark-demo-footer span { display: block; color: rgba(255,255,255,0.72); font-size: 0.8rem; margin-top: 2px; }
      .aisitespark-demo-footer a {
        flex-shrink: 0;
        color: #ffffff;
        background: #16a34a;
        text-decoration: none;
        border-radius: 999px;
        padding: 11px 16px;
        font-size: 0.88rem;
        font-weight: 700;
      }
      @media (max-width: 640px) {
        body { padding-bottom: 124px; }
        .aisitespark-demo-footer {
          align-items: stretch;
          flex-direction: column;
        }
        .aisitespark-demo-footer a { text-align: center; }
      }
    </style>
    <div class="aisitespark-demo-footer">
      <div>
        <strong>Demo Mode</strong>
        <span>This preview was generated for ${companyName}.</span>
      </div>
      <a href="${whatsappHref}" target="_blank" rel="noopener noreferrer">Contact on WhatsApp</a>
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
    applySharedUpgrade(templateBase, styleSuffix, data, targetDir, demoId);

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
    return { targetDir, demoId, githubUrl, pagesUrl, repoName: demoId };
}

function applySharedUpgrade(templateBase, styleSuffix, data, targetDir, demoId) {
    const industry = industries[templateBase];
    if (!industry) return;

    const sharedDir = path.join(process.cwd(), 'templates', 'shared');
    copyDirectory(path.join(sharedDir, 'assets', templateBase), path.join(targetDir, 'assets', templateBase));
    copyDirectory(path.join(sharedDir, 'styles'), path.join(targetDir, 'styles'));

    const template = buildSharedTemplate(templateBase, styleSuffix, data, industry, demoId);
    fs.writeFileSync(path.join(targetDir, 'index.html'), template);
}

function copyDirectory(src, dest) {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((entry) => {
        const from = path.join(src, entry);
        const to = path.join(dest, entry);
        if (fs.statSync(from).isDirectory()) copyDirectory(from, to);
        else fs.copyFileSync(from, to);
    });
}

function buildSharedTemplate(templateBase, styleSuffix, data, industry, demoId) {
    const companyName = data.companyName;
    const brandMarkup = data.logoUrl && data.logoUrl.startsWith('data:image')
        ? `<img class="brand-logo" src="${data.logoUrl}" alt="${companyName} logo">`
        : companyName;
    const variantClass = styleSuffix === 'v2' ? 'variant-showcase' : styleSuffix === 'v3' ? 'variant-lead' : 'variant-local';
    const primaryCta = styleSuffix === 'v3' ? 'Request Enquiry' : 'Contact Us';
    const ownerWhatsApp = (process.env.OWNER_WHATSAPP_NUMBER || '').replace(/\D/g, '');
    const whatsappHref = ownerWhatsApp
        ? `https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(`Hi, I want to claim the demo website for ${companyName}. Demo ID: ${demoId}`)}`
        : `${data.baseUrl || 'https://automated-website-generator.vercel.app'}/contact`;
    const serviceCards = industry.services.map((service) => `<article class="card"><h3>${service}</h3><p>Clear, relevant information that helps visitors decide the next step.</p></article>`).join('');
    const proofCards = industry.proof.map((item) => `<article class="card"><h3>${item}</h3><p>Credible signals that support trust without inventing unverifiable claims.</p></article>`).join('');
    const leadBlock = styleSuffix === 'v3'
        ? `<aside class="lead-form"><label>Name</label><input placeholder="Your name"><label>Phone</label><input placeholder="Phone number"><label>Message</label><textarea rows="4" placeholder="Tell us what you need"></textarea><a class="btn btn-primary" href="#contact">Send enquiry</a></aside>`
        : `<div class="hero-media"><img src="${industry.image}" alt="${templateBase} hero"></div>`;
    const mediaBlock = styleSuffix === 'v3'
        ? `<div class="hero-media"><img src="${industry.image}" alt="${templateBase} hero"></div>`
        : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName}</title>
  <link rel="stylesheet" href="styles/system.css">
</head>
<body class="${variantClass}">
  <nav class="nav">
    <div class="container nav-inner">
      <a class="brand" href="#">${brandMarkup}</a>
      <div class="links">
        <a href="#services">Services</a>
        <a href="#why-us">Why us</a>
        <a href="#contact">Contact</a>
      </div>
    </div>
  </nav>
  <main>
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <div class="eyebrow">${industry.eyebrow}</div>
          <h1>${industry.headline}</h1>
          <p class="lead">${industry.lead}</p>
          <div class="actions"><a class="btn btn-primary" href="#contact">${primaryCta}</a><a class="btn btn-secondary" href="#services">Explore services</a></div>
        </div>
        ${leadBlock}
      </div>
    </section>
    ${mediaBlock}
    <section id="services" class="section">
      <div class="container">
        <div class="section-head"><h2>What ${companyName} can present clearly</h2><p>${industry.secondary}</p></div>
        <div class="cards">${serviceCards}</div>
      </div>
    </section>
    <section id="why-us" class="band">
      <div class="container split">
        <img src="${industry.image}" alt="${templateBase} support">
        <div>
          <div class="section-head"><h2>Built to answer buyer questions early</h2><p>Instead of filler claims, this page structure gives visitors the information they need to trust the business and act.</p></div>
          <div class="cards">${proofCards}</div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head"><h2>Common questions</h2><p>Practical detail reduces drop-off and makes the business feel easier to contact.</p></div>
        <div class="faq-grid">
          <article class="card"><h3>What should a visitor do first?</h3><p>Use a clear CTA tied to the service type and business goal.</p></article>
          <article class="card"><h3>What information matters most?</h3><p>Services, process, contact details, and enough proof to reduce hesitation.</p></article>
        </div>
      </div>
    </section>
    <section id="contact" class="band">
      <div class="container contact-grid">
        <div>
          <div class="section-head"><h2>Start the conversation</h2><p>Use this section for phone, WhatsApp, address, timings, or an enquiry path that matches the business.</p></div>
        </div>
        <div class="contact-panel"><h3>${companyName}</h3><p>Phone: ${data.businessPhone}</p><p>Email: ${data.businessEmail}</p><p>Location: ${data.businessLocation}</p><a class="btn btn-primary" href="#">${primaryCta}</a></div>
      </div>
    </section>
  </main>
  <section class="band">
    <div class="container contact-grid">
      <div>
        <div class="section-head"><h2>Want this site launched for ${companyName}?</h2><p>Move from preview to a fully owned website with final content, domain setup, and launch support.</p></div>
      </div>
      <div class="contact-panel"><h3>Demo Mode</h3><p>This preview was generated for ${companyName}.</p><a class="btn btn-primary" href="${whatsappHref}" target="_blank" rel="noopener noreferrer">Contact on WhatsApp</a></div>
    </div>
  </section>
  <footer class="footer"><div class="container">&copy; 2026 ${companyName}. All rights reserved.</div></footer>
</body>
</html>`;
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
