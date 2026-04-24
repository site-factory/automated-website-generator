/**
 * =====================================================
 * GOOGLE APPS SCRIPT — Paste this into script.google.com
 * =====================================================
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and create a new project
 * 2. Paste this entire file into the editor
 * 3. Click Deploy → New Deployment → Web App
 * 4. Set "Execute as" → Me, "Who has access" → Anyone
 * 5. Copy the Web App URL
 * 6. Add it to your .env.local as:
 *    GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ID/exec
 * 7. Create a Google Sheet and paste the Sheet ID below
 */

// ⬇️ REPLACE THIS with your Google Sheet ID (from the URL)
const SHEET_ID = '1Gi6uooqfRi6zZkAG7HvQZRJjPw55vlHsYSBVYvuhyw0';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const event = payload.event;
    const data = payload.data || {};

    const ss = SpreadsheetApp.openById(SHEET_ID);

    if (event === 'demo_generated') {
      let sheet = ss.getSheetByName('Demos');
      if (!sheet) {
        sheet = ss.insertSheet('Demos');
        sheet.appendRow(['Timestamp', 'Email', 'Business Name', 'Industry', 'Palette', 'Goal', 'Layout', 'Demo URL', 'GitHub Repo']);
        sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
      }
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.email || '',
        data.businessName || '',
        data.industry || '',
        data.paletteName || '',
        data.goal || '',
        data.layout || '',
        data.demoUrl || '',
        data.githubUrl || '',
      ]);
    }

    else if (event === 'contact_form') {
      let sheet = ss.getSheetByName('Contacts');
      if (!sheet) {
        sheet = ss.insertSheet('Contacts');
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Service', 'Message']);
        sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
      }
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.name || '',
        data.email || '',
        data.phone || '',
        data.service || '',
        data.message || '',
      ]);
    }

    else if (event === 'claim_visit') {
      let sheet = ss.getSheetByName('Claims');
      if (!sheet) {
        sheet = ss.insertSheet('Claims');
        sheet.appendRow(['Timestamp', 'Demo Ref ID', 'Referrer']);
        sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
      }
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.demoId || '',
        data.referrer || '',
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Required for CORS preflight
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ready' }))
    .setMimeType(ContentService.MimeType.JSON);
}
