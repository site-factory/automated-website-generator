# Technical Planning: Industry Vertical Strategy

## 1. Objective
To maximize conversion rates by ensuring every automated demo feels bespoke to the client's specific industry. We will move away from a "Universal Template" in favor of a specialized "Template Library" categorized by industry verticals.

## 2. Multi-Template Architecture
The system will maintain several independent "Master Template" repositories. Each repository represents a specific industry and is optimized for that vertical's user experience (UX) and aesthetic.

### 2.1 Proposed Initial Verticals
| Industry | Design Language | Key Components |
| :--- | :--- | :--- |
| **Professional Services** (Law, Consulting) | Corporate, Trust-focused, Clean | Bio sections, Testimonials, Service lists |
| **Retail & Fashion** | Aesthetic, Minimal, High-res | Parallax imagery, Product galleries, Lookbooks |
| **Medical & Wellness** (Hospitals, Clinics) | Sanitary, Approachable, Calm | Appointment CTAs, Doctor profiles, Facility info |
| **Personal Brand/Portfolio** (Artists, Devs) | Creative, Bold, Impactful | Project grids, Resume integration, Social proof |

---

## 3. Platform UX & Frontend Strategy

### 3.1 The "Concierge" Flow (Multi-Step Wizard)
To maximize conversion, the intake process will be a focused, step-by-step experience:
1.  **Identity:** Business name and Industry selection (using high-fidelity visual cards).
2.  **Branding:** Logo upload and palette selection.
3.  **Personality (The "Mood" Selector):**
    *   **The Visionary:** Minimalist, high-end imagery, short impactful copy.
    *   **The Authority:** Informative, trust-focused, structured layouts.
    *   **The Friendly Pro:** Warm, approachable, social-proof heavy.
4.  **Lead Capture:** Email entry to "finalize" the demo generation.

### 3.2 Automated Brand Extraction
*   **Color-Thief Integration:** Upon logo upload, the frontend will automatically extract the dominant brand color and suggest it as the `primary_color`.
*   **Engagement Hook:** A real-time message ("Brand colors detected!") will provide immediate feedback and technical trust.

---

## 4. The "Standard Content Schema" (Technical Requirement)
To ensure the backend automation script works seamlessly across *any* template, all templates MUST adhere to a unified variable naming convention.

### 3.1 Global Placeholder Variables
Every template, regardless of industry, must use these double-bracketed placeholders in the HTML/CSS:
*   `{{COMPANY_NAME}}`: The business name provided.
*   `{{PRIMARY_COLOR}}`: The hex code (e.g., `#FF5500`) used for buttons, links, and accents.
*   `{{SECONDARY_COLOR}}`: A generated or complementary color for depth.
*   `{{LOGO_URL}}`: Path to the uploaded logo asset.
*   `{{HERO_HEADING}}`: Industry-specific headline customized with the company name.

### 3.2 Dynamic Asset Management
*   Logo files will always be renamed to `brand-logo.png` (or `.svg`) during the automation process.
*   The templates will reference `/assets/brand-logo.png` to avoid needing to update the code's image path.

---

## 5. Automation Workflow (Backend Selection Logic)
1.  **Selection:** User selects "Hospital" + "The Authority" mood.
2.  **Mapping:** Backend maps to `template-medical-v1`.
3.  **Content Injection:** The replacement engine swaps text using the "Authority" library for that niche.
4.  **Cloning:** The API clones the repository.
5.  **Injection:** The build script runs placeholders.
6.  **Progress Theater:** Frontend displays real-time logs (e.g., "Cloning repo...", "Injecting Brand Assets...") to manage the 60s wait time.
7.  **Deployment:** Live URL generation.

---

## 6. Phased Rollout Plan
The "Intake Engine" will handle the routing via a lookup table:

1.  **Selection:** User selects "Hospital" from the dropdown.
2.  **Mapping:** Backend maps "Hospital" -> `github.com/agency/template-medical-v1`.
3.  **Cloning:** The API clones *that specific* repository into the user's new private repo.
4.  **Injection:** The build script runs the replacement engine on the cloned files using the user's data payload.
5.  **Deployment:** The site is hosted under `demo-hospital-user-123.agency.com`.

---

## 5. Phased Rollout Plan
*   **Phase 1:** Build the "Professional Services" Master (The most versatile).
*   **Phase 2:** Implement the Backend String Replacement Engine.
*   **Phase 3:** Create "Retail/Fashion" and "Medical" templates.
*   **Phase 4:** Optimize the Loading State Experience (User waits while CI/CD runs).

---

## 6. Business Advantages
*   **Precision Targeting:** We can market specific landing pages to specific industries (e.g., "Create a Hospital website in 60 seconds").
*   **Scalability:** Adding a new niche only requires building one new template repo, without touching the core backend code.
*   **Premium Positioning:** Allows for high-quality, industry-specific micro-animations that a generic template couldn't support.
