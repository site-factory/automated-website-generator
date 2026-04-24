import { NextRequest, NextResponse } from 'next/server';

/**
 * /api/track — Forwards event data to a Google Apps Script Web App
 * which writes it into a Google Sheet.
 *
 * Expected body:
 * {
 *   "event": "demo_generated" | "contact_form" | "claim_visit",
 *   "data": { ...fields }
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sheetWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (!sheetWebhookUrl) {
      console.warn('[Track] GOOGLE_SHEET_WEBHOOK_URL not set — skipping.');
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Add server-side timestamp
    const payload = {
      ...body,
      data: {
        ...body.data,
        timestamp: new Date().toISOString(),
      },
    };

    // Fire-and-forget to Google Apps Script (don't block the user)
    fetch(sheetWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => console.error('[Track] Sheet webhook error:', err.message));

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Track] Error:', message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
