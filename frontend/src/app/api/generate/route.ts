import { NextResponse } from 'next/server';
import { createLead, updateLeadGeneration } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const sanitizeText = (value: unknown) =>
      String(value || '')
        .trim()
        .replace(/[<>]/g, '');
    const data = {
      ...payload,
      email: sanitizeText(payload.email),
      businessName: sanitizeText(payload.businessName),
      industry: sanitizeText(payload.industry),
      mood: sanitizeText(payload.mood),
      templateStyle: sanitizeText(payload.templateStyle || 'v1'),
    };
    const paletteName = data.paletteName || 'Ocean Professional';
    const primaryColor = data.primaryColor || '#1565C0';
    const secondaryColor = data.secondaryColor || '#0097A7';
    const accentColor = data.accentColor || '#26C6DA';
    const bgTint = data.bgTint || '#E3F2FD';

    const lead = await createLead({
      email: data.email,
      businessName: data.businessName,
      industry: data.industry,
      templateStyle: data.templateStyle || 'v1',
      mood: data.mood,
      paletteName,
      primaryColor,
      secondaryColor,
      accentColor,
      bgTint,
    });
    
    // Inject the base URL for generated assets that need to point back to the app.
    const requestUrl = new URL(request.url);
    data.baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
    
    // Use a static require so Vercel's bundler correctly traces and includes it
    const { generateDemo } = require('../../../../scripts/repo-factory');

    const result = await generateDemo(data);
    const finalDemoUrl = result.pagesUrl || `/demos/${result.demoId}`;
    await updateLeadGeneration(lead.id, {
      demoId: result.demoId,
      demoUrl: finalDemoUrl,
      githubRepoUrl: result.githubUrl || null,
      githubRepoName: result.repoName || null,
      githubRepoId: result.githubRepoId || null,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Demo generated successfully',
      demoUrl: finalDemoUrl,
      repoUrl: result.githubUrl || null,
      leadId: lead.id,
    });
  } catch (error) {
    console.error('Error in generate API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate demo' },
      { status: 500 }
    );
  }
}
