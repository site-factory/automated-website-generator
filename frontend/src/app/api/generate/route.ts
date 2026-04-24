import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Use a static require so Vercel's bundler correctly traces and includes it
    const { generateDemo } = require('../../../../../scripts/repo-factory');

    const result = await generateDemo(data);
    const finalDemoUrl = result.pagesUrl || `/demos/${result.demoId}`;

    // --- PHASE 6: POST-DEMO CONVERSION FLOW ---
    
    // 1. CRM / Webhook Integration
    // In a production environment, this would be a real POST to Zapier, Make, HubSpot, etc.
    const webhookUrl = process.env.CRM_WEBHOOK_URL || 'https://dummy-crm-webhook.com/lead';
    console.log(`[CRM] Sending lead data to ${webhookUrl}...`);
    console.log(`[CRM] Lead: ${data.email} | Business: ${data.businessName} | Demo URL: ${finalDemoUrl}`);
    // Simulate async webhook request
    await new Promise(r => setTimeout(r, 300));
    console.log('[CRM] Lead successfully recorded in CRM.');

    // 2. Email Notification with Demo Link
    // In production, use SendGrid, Resend, or Nodemailer here
    console.log(`[EMAIL] Sending demo link email to ${data.email}...`);
    console.log(`[EMAIL] Subject: Your AI SiteSpark Demo is Ready!`);
    console.log(`[EMAIL] Body: Hi there, here is the link to your custom website demo: ${finalDemoUrl}`);
    // Simulate async email sending
    await new Promise(r => setTimeout(r, 500));
    console.log(`[EMAIL] Email sent successfully.`);

    return NextResponse.json({ 
      success: true, 
      message: 'Demo generated successfully',
      demoUrl: finalDemoUrl,
      repoUrl: result.githubUrl || null
    });
  } catch (error) {
    console.error('Error in generate API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate demo' },
      { status: 500 }
    );
  }
}
