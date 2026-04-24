# Product Requirements Document (PRD)

**Project:** Automated Demo-Driven Client Acquisition Platform
**Prepared For:** Self
**Project Sponsor:** Self
**Date:** April 2026

## 1. Introduction

### 1.1 Purpose of the Document
This Product Requirements Document (PRD) outlines the architecture, user journey, and technical requirements for developing an automated, lead-generation web platform. The platform is designed to provide immediate, tangible value to prospective clients by generating personalized, high-fidelity website demos based on minimal initial input.

### 1.2 Executive Summary
The traditional web development sales cycle is heavily reliant on manual consultations and proposals, which creates a high barrier to entry for small business owners. This product introduces a "Product-Led Growth" approach. By allowing users to submit their industry, business name, and logo, the system will autonomously provision a private code repository, inject the user's data into a pre-designed template, and deploy a live, static demo website within minutes. This instant gratification significantly bridges the "imagination gap" and increases lead conversion rates.

## 2. The Idea Implementation (Architecture Strategy)
To ensure high scalability, zero data collisions between concurrent users, and an impressive professional handover process, the system utilizes a **"One Repository Per User"** architectural model built on top of version control infrastructure.

### 2.1 The "Repo Factory" Concept
Instead of hosting all client demos on a single server or branch—which risks overwriting data and performance bottlenecks—the platform treats every lead as an isolated containerized project. The core components include:
* **The Master Template:** A perfectly curated, statically generated website template containing data placeholders.
* **The Trigger Mechanism:** An API integration connecting the front-end intake form directly to the repository provisioning service.
* **The Build Automation:** A cloud-based runner that executes a find-and-replace operation on the cloned code, swapping placeholders with user-submitted variables.
* **The Hosting Layer:** A decentralized static hosting service that serves the newly customized repository on a unique URL.

## 3. Operational Steps and Workflow
The process is divided into distinct phases, detailing both the user-facing experience and the automated backend orchestration.

### Phase 1: Intake and Data Capture
* **User Action:** The user arrives at the primary agency website and navigates to the "Instant Demo" landing page.
* **Data Collection:** The user completes a concise, 3-to-4 step form. Required fields include Business Name, Industry/Niche selection, Primary Brand Color, and Logo Upload.
* **Validation:** The system ensures all required fields are populated and the logo is in a valid image format before proceeding.

### Phase 2: Automated Repository Provisioning
* **API Trigger:** Upon form submission, the intake engine sends a payload to the version control API.
* **Repository Cloning:** The API utilizes a "Template Repository" to generate a brand-new, isolated repository specifically named for the user (e.g., `demo-business-name-123`).

### Phase 3: Demo Assembly & Customization
* **Workflow Initialization:** The creation of the new repository automatically triggers a pre-configured automation script inside that specific environment.
* **Data Injection:** The script scans the HTML and CSS files, replacing preset variables with the user's explicit data.
* **Asset Management:** The uploaded logo is retrieved and placed into the appropriate assets folder, updating the main layout paths.

### Phase 4: Deployment and Delivery
* **Static Generation:** The automation script finalizes the code and pushes the changes to the deployment branch.
* **URL Generation:** The hosting provider activates the site and generates a live, read-only URL.
* **User Notification:** The user, who has been viewing a loading state, is redirected to the live demo, or an automated email is dispatched containing the link.

### Phase 5: Post-Demo Conversion
**The Conversion Handover:** The demo is presented with a persistent "Hire Us to Launch This" interface. Because the website already exists in a dedicated repository, the sales pitch transitions from "We can build this" to "This code is already written; sign the contract and we will transfer ownership."

## 4. System Requirements

### 4.1 Functional Requirements
| Requirement | Description |
| :--- | :--- |
| Form Data Handling | The intake form must securely capture and encode text, color hex codes, and image files for API transmission. |
| Template Categorization | The system must route the user to the correct Master Template based on their "Industry" selection. |
| String Replacement Engine | The backend script must accurately parse HTML files without corrupting surrounding tags or nested elements. |
| Read-Only State | The generated demo must not allow the user to edit the code or the content directly. |

### 4.2 Non-Functional Requirements
* **Speed/Performance:** The entire process from form submission to a live URL must conclude within 45 to 60 seconds to maintain user engagement.
* **Concurrency:** The system must comfortably handle simultaneous demo requests without queuing delays or cross-contamination of client data.
* **Data Retention (Janitor Policy):** To prevent repository bloat, the system requires a scheduled job to permanently delete non-converted demo repositories after 30 days.
* **Security:** The master template must not contain proprietary backend secrets, billing credentials, or sensitive administrative access keys.

### 4.3 Infrastructure & Tooling Requirements
* **Intake Environment:** A fast, static front-end framework capable of handling multi-step forms and loading state animations.
* **Version Control Platform:** A system equipped with API-based repository templating and integrated CI/CD runners for automated script execution.
* **Static Hosting Integration:** A service capable of serving static assets directly from a repository branch without requiring manual server provisioning.
* **Communication Layer:** An integration via Webhooks or API to send lead data to the CRM upon demo generation.
