Website Factory: Strategic & Technical Roadmap
1. Project Overview
A lead-generation and automated fulfillment platform targeting local Indian businesses (Clinics, Temples, Schools, Cafes, etc.). The system provides instant "visualization" by generating a live demo website on GitHub Pages based on user inputs.

2. Core Architecture
Frontend: Vercel-hosted generator.

Fulfillment: GitHub API creating unique repositories from 45 industry-specific templates (15 industries x 3 variations).

Hosting: GitHub Pages (github.io) for demos.

Cleanup: jantor.js script to manage repository limits.

3. The "Smart Guy" Technical Guardrails
Lead Persistence: Every lead must be saved to a Database (Supabase) before the GitHub API is triggered. Do not lose data on API failures.

The "404" Prevention: Implement a polling mechanism on the frontend. The "View Website" button should remain disabled/hidden until the github.io URL returns a 200 OK status.

Whitelisting Logic: jantor.js must be updated to check for GitHub Repository Topics. If a repo has the topic status:paid or status:active, it must be skipped by the deletion logic regardless of age.

Input Sanitization: All user-provided strings (Business Name, Owner Name) must be sanitized to prevent breaking HTML structures or API payloads.

Conversion Injection: Every generated template must include a persistent "Demo Mode" footer or ribbon with a Call-to-Action (CTA) linking to the owner's WhatsApp.

4. Market Strategy
Target: MSME sector in India (63M+ businesses).

Competitive Edge: Speed and Visualization. Bypassing the "abstract proposal" phase by providing a tangible URL in <60 seconds.

Monetization: Low-cost entry (₹10,000 range) + Monthly maintenance/hosting subscription.

5. Implementation To-Do List (Next Steps)
Integrate Supabase: Create a leads table and hook it to the form submission.

Refine Jantor.js: Add logic to fetch topics and filter out paid clients.

Frontend Polling: Add an async check for site availability before revealing the link.

Template Update: Add the "Contact on WhatsApp" fixed footer to all 45 templates.

WhatsApp Automation: Set up a trigger (Make.com/n8n) to message the user the moment their demo is ready.