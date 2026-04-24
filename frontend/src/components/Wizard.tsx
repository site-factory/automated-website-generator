"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Stethoscope, Shirt, Code, Coffee,
  CheckCircle2, FileUp, LayoutGrid, Users, FolderOpen,
  Target, LayoutTemplate, FileText, Brain,
  ArrowRight, ArrowLeft, Mail, Sparkles,
  Grid2x2, Rows3, LayoutPanelTop
} from 'lucide-react';

type WizardStep = 1 | 2 | 3 | 4 | 5;

interface FormData {
  goal: string;
  layout: string;
  industry: string;
  logoUrl: string | null;
  extractedColor: string;
  activeColor: string;
  mood: string;
  businessName: string;
  email: string;
}

export default function Wizard() {
  const [step, setStep] = useState<WizardStep>(1);
  const [formData, setFormData] = useState<FormData>({
    goal: '',
    layout: '',
    industry: 'Medical',
    logoUrl: null,
    extractedColor: '',
    activeColor: 'Radiant Blue',
    mood: '',
    businessName: '',
    email: '',
  });
  const [extracting, setExtracting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progressLogs, setProgressLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { num: 1, label: 'Goal', icon: Target },
    { num: 2, label: 'Layout', icon: LayoutTemplate },
    { num: 3, label: 'Brand Identity', icon: null },
    { num: 4, label: 'Content', icon: FileText },
    { num: 5, label: 'Review', icon: CheckCircle2 },
  ];

  const industries = [
    { id: 'Medical', icon: Stethoscope },
    { id: 'Fashion', icon: Shirt },
    { id: 'Tech', icon: Code },
    { id: 'Food', icon: Coffee },
  ];

  const colors = [
    { id: 'Radiant Blue', color: '#1d87f5' },
    { id: 'Royal Purple', color: '#8a2be2' },
    { id: 'Forest Green', color: '#228b22' },
    { id: 'Pastel Pink', color: '#ffb6c1' },
  ];

  const goals = [
    { id: 'lead-gen', label: 'Generate Leads', desc: 'Capture emails and contact info from visitors' },
    { id: 'portfolio', label: 'Showcase Work', desc: 'Display projects, case studies, and credentials' },
    { id: 'ecommerce', label: 'Sell Products', desc: 'Set up a storefront with product listings' },
    { id: 'info', label: 'Inform & Educate', desc: 'Share information about services and expertise' },
  ];

  const layouts = [
    { id: 'single', label: 'Single Page', desc: 'Everything on one scrollable page', icon: Rows3 },
    { id: 'multi', label: 'Multi Page', desc: 'Separate pages for each section', icon: Grid2x2 },
    { id: 'landing', label: 'Landing Page', desc: 'Focused conversion page with CTA', icon: LayoutPanelTop },
  ];

  const moods = [
    { id: 'visionary', label: 'The Visionary', desc: 'Minimalist, high-end imagery, short impactful copy' },
    { id: 'authority', label: 'The Authority', desc: 'Trust-focused, structured layouts, data-driven' },
    { id: 'friendly', label: 'The Friendly Pro', desc: 'Warm, approachable, heavy on social proof' },
  ];

  // Logo color extraction via Canvas API
  const extractColor = (file: File) => {
    setExtracting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) { setExtracting(false); return; }
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        // Sample multiple points for better color detection
        const samples: number[][] = [];
        const step = Math.max(4, Math.floor(data.length / 400));
        for (let i = 0; i < data.length; i += step) {
          const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
          // Skip near-white, near-black, and transparent pixels
          if (a < 128) continue;
          if (r > 240 && g > 240 && b > 240) continue;
          if (r < 15 && g < 15 && b < 15) continue;
          samples.push([r, g, b]);
        }

        if (samples.length > 0) {
          const avg = samples.reduce((acc, s) => [acc[0]+s[0], acc[1]+s[1], acc[2]+s[2]], [0,0,0]);
          const r = Math.round(avg[0] / samples.length);
          const g = Math.round(avg[1] / samples.length);
          const b = Math.round(avg[2] / samples.length);
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          setFormData(prev => ({ ...prev, logoUrl: e.target?.result as string, extractedColor: hex }));
        } else {
          setFormData(prev => ({ ...prev, logoUrl: e.target?.result as string }));
        }
        setExtracting(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Progress Theater simulation + Real API Call
  const startGeneration = async () => {
    setGenerating(true);
    setProgressLogs([]);
    const baseLogs = [
      '[SYS] Initializing AuraGen Engine v2.0...',
      `[OK]  Industry detected: ${formData.industry}`,
      `[OK]  Business name: "${formData.businessName}"`,
      '[...]  Sending payload to Repo Factory...',
    ];

    baseLogs.forEach((log, i) => {
      setTimeout(() => setProgressLogs(prev => [...prev, log]), (i + 1) * 400);
    });

    try {
      await new Promise(r => setTimeout(r, 1800)); // Let the theater play a bit

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setProgressLogs(prev => [...prev, '[OK]  Repository provisioned successfully']);
        setProgressLogs(prev => [...prev, `[OK]  Injecting brand color ${formData.activeColor}...`]);
        if (formData.logoUrl) {
           setProgressLogs(prev => [...prev, '[OK]  Logo placed in /assets/brand-logo']);
        }
        setProgressLogs(prev => [...prev, `[OK]  Applying "${formData.mood}" content personality...`]);
        
        setTimeout(() => {
          setProgressLogs(prev => [...prev, '[...]  Building static site...']);
          setProgressLogs(prev => [...prev, '[OK]  Site compiled — 0 errors']);
          setProgressLogs(prev => [...prev, '[...]  Deploying to global edge network...']);
          setProgressLogs(prev => [...prev, `[DONE] Your demo is live! ${data.demoUrl}`]);
        }, 1500);
      } else {
        setProgressLogs(prev => [...prev, `[ERROR] ${data.error || 'Generation failed'}`]);
      }
    } catch (err) {
      setProgressLogs(prev => [...prev, '[ERROR] Failed to connect to engine']);
    }
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return !!formData.goal;
      case 2: return !!formData.layout;
      case 3: return !!formData.industry && !!formData.activeColor;
      case 4: return !!formData.mood && !!formData.businessName;
      case 5: return !!formData.email;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < 5) setStep((step + 1) as WizardStep);
    else startGeneration();
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as WizardStep);
  };

  if (generating) {
    return (
      <div className="wizard-card w-full flex">
        {/* Sidebar */}
        <div className="hidden md:flex w-[80px] border-r border-[#1f222e] flex-col items-center py-8 bg-[#0c0e14]">
          <div style={{ marginBottom: "40px" }} className="text-[var(--cyan-glow)] drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
            <Brain className="w-7 h-7" />
          </div>
          <div style={{ marginBottom: "24px" }} className="text-[var(--cyan-glow)] bg-[rgba(0,240,255,0.1)] p-3 rounded-xl flex justify-center items-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Progress Theater */}
        <div className="flex-1 min-w-0 w-full p-5 sm:p-10 md:px-16 md:py-12 flex flex-col items-center justify-center" style={{ minHeight: "400px" }}>
          {/* Spinner */}
          <div style={{ width: "80px", height: "80px", marginBottom: "40px", position: "relative" }}>
            <div style={{
              position: "absolute", inset: 0, border: "3px solid rgba(0,240,255,0.15)",
              borderRadius: "50%"
            }}></div>
            <div style={{
              position: "absolute", inset: 0, border: "3px solid var(--cyan-glow)",
              borderTop: "3px solid transparent", borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
          </div>

          <h2 className="text-2xl sm:text-[1.75rem] font-semibold mb-2 text-white text-center leading-tight text-balance">
            Building your masterpiece...
          </h2>
          <p className="text-[#8b8e98] mb-10 text-[0.95rem] text-center text-balance">
            Hang tight — our AI is crafting your bespoke demo.
          </p>

          {/* Terminal Logs */}
          <div style={{
            width: "100%", maxWidth: "520px",
            background: "#0c0e14", border: "1px solid #1f222e",
            borderRadius: "12px", padding: "24px",
            fontFamily: "monospace", fontSize: "0.8rem", lineHeight: "1.8",
          }}>
            {progressLogs.map((log, i) => (
              <div key={i} style={{
                color: log.startsWith('[DONE]') ? '#00f0ff'
                  : log.startsWith('[OK]') ? '#4ade80'
                  : log.startsWith('[...]') ? '#facc15'
                  : '#8b8e98',
                opacity: i === progressLogs.length - 1 && !log.startsWith('[DONE]') ? 1 : 0.85,
              }}>
                {log}
              </div>
            ))}
            {progressLogs.length > 0 && !progressLogs[progressLogs.length - 1]?.startsWith('[DONE]') && (
              <span style={{ display: "inline-block", width: "8px", height: "16px", background: "var(--cyan-glow)", animation: "blink 1s step-end infinite" }}></span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard-card w-full flex">

      {/* Left Icon Sidebar */}
      <div className="hidden md:flex w-[80px] border-r border-[#1f222e] flex-col items-center py-8 bg-[#0c0e14]">
        <div style={{ marginBottom: "40px" }} className="text-[var(--cyan-glow)] drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
          <Brain className="w-7 h-7" />
        </div>
        <button style={{ marginBottom: "24px" }} className="appearance-none outline-none border-none text-[var(--cyan-glow)] bg-[rgba(0,240,255,0.1)] p-3 rounded-xl cursor-pointer transition-colors shadow-[0_0_15px_rgba(0,240,255,0.1)_inset] flex justify-center items-center">
          <LayoutGrid className="w-6 h-6" />
        </button>
        <button style={{ marginBottom: "24px" }} className="appearance-none outline-none border-none bg-transparent hover:bg-white/5 text-[#a1a3ab] hover:text-white p-3 rounded-xl cursor-pointer transition-colors flex justify-center items-center">
          <Users className="w-6 h-6" />
        </button>
        <button style={{ marginBottom: "24px" }} className="appearance-none outline-none border-none bg-transparent hover:bg-white/5 text-[#a1a3ab] hover:text-white p-3 rounded-xl cursor-pointer transition-colors flex justify-center items-center">
          <FolderOpen className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 w-full p-4 sm:p-8 md:px-16 md:py-12">

        {/* Stepper */}
        <div className="scrollbar-hide" style={{ display: "flex", justifyContent: "flex-start", overflowX: "auto", gap: "12px", marginBottom: "40px", paddingBottom: "8px" }}>
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num as WizardStep)}
              className={`step-item cursor-pointer whitespace-nowrap ${step === s.num ? 'active' : ''}`}
              style={{ border: step === s.num ? '1px solid var(--cyan-glow)' : '1px solid transparent' }}
            >
              {s.num === step ? (
                <div className="step-number">{s.num}</div>
              ) : (
                s.icon && <s.icon style={{ width: "18px", height: "18px", opacity: 0.6 }} />
              )}
              {s.label}
            </button>
          ))}
        </div>

        {/* ============ STEP 1: GOAL ============ */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-white mb-3 leading-tight text-balance">
                Step 1: What&apos;s your website goal?
              </h2>
              <p className="text-[#8b8e98] text-base text-balance">Choose the primary purpose of your website.</p>
            </div>

            <div style={{ display: "grid", gap: "16px", maxWidth: "700px", margin: "0 auto" }} className="grid-cols-1 sm:grid-cols-2">
              {goals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setFormData(prev => ({ ...prev, goal: g.id }))}
                  className="industry-btn cursor-pointer"
                  style={{
                    flexDirection: "column", alignItems: "flex-start", padding: "24px",
                    borderColor: formData.goal === g.id ? 'var(--cyan-glow)' : '#1f222e',
                    background: formData.goal === g.id ? 'rgba(0, 240, 255, 0.03)' : '#14151a',
                    boxShadow: formData.goal === g.id ? '0 0 15px rgba(0, 240, 255, 0.1) inset' : 'none',
                  }}
                >
                  <span style={{ fontSize: "1rem", fontWeight: 600, color: formData.goal === g.id ? "white" : "#a1a3ab", marginBottom: "8px", display: "block" }}>{g.label}</span>
                  <span style={{ fontSize: "0.8rem", color: "#6b6e78", lineHeight: 1.5 }}>{g.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============ STEP 2: LAYOUT ============ */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-white mb-3 leading-tight text-balance">
                Step 2: Choose your layout style
              </h2>
              <p className="text-[#8b8e98] text-base text-balance">How should your website be structured?</p>
            </div>

            <div style={{ display: "grid", gap: "16px", maxWidth: "800px", margin: "0 auto" }} className="grid-cols-1 sm:grid-cols-3">
              {layouts.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setFormData(prev => ({ ...prev, layout: l.id }))}
                  className="industry-btn cursor-pointer"
                  style={{
                    flexDirection: "column", alignItems: "center", textAlign: "center", padding: "32px 20px",
                    borderColor: formData.layout === l.id ? 'var(--cyan-glow)' : '#1f222e',
                    background: formData.layout === l.id ? 'rgba(0, 240, 255, 0.03)' : '#14151a',
                    boxShadow: formData.layout === l.id ? '0 0 15px rgba(0, 240, 255, 0.1) inset' : 'none',
                  }}
                >
                  <l.icon style={{ width: "32px", height: "32px", marginBottom: "16px", color: formData.layout === l.id ? 'var(--cyan-glow)' : '#6b6e78' }} />
                  <span style={{ fontSize: "1rem", fontWeight: 600, color: formData.layout === l.id ? "white" : "#a1a3ab", marginBottom: "8px", display: "block" }}>{l.label}</span>
                  <span style={{ fontSize: "0.8rem", color: "#6b6e78", lineHeight: 1.5 }}>{l.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============ STEP 3: BRAND IDENTITY ============ */}
        {step === 3 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-white mb-3 leading-tight text-balance">
                Step 3: Define Your Brand Identity
              </h2>
              <p className="text-[#8b8e98] text-base text-balance">Set your visual style and assets.</p>
            </div>

            <div style={{ display: "grid", gap: "24px" }} className="grid-cols-1 md:grid-cols-[1fr_2fr_1fr] md:gap-10">

              {/* Column 1: Industry Presets */}
              <div>
                <h3 style={{ color: "#8b8e98", fontSize: "0.8rem", fontWeight: 600, marginBottom: "20px", paddingLeft: "8px", letterSpacing: "0.5px" }}>Industry Presets</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {industries.map((ind) => (
                    <button
                      key={ind.id}
                      onClick={() => setFormData(prev => ({ ...prev, industry: ind.id }))}
                      className={`industry-btn cursor-pointer ${formData.industry === ind.id ? 'active' : ''}`}
                    >
                      <ind.icon style={{ width: "20px", height: "20px", opacity: 0.8 }} />
                      {ind.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column 2: Upload Logo */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className="upload-area" style={{ width: "100%", minHeight: "350px" }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <h3 style={{ fontSize: "1.15rem", color: "white", fontWeight: 500, marginBottom: "32px", position: "relative", zIndex: 10 }}>Upload Your Brand Logo</h3>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, position: "relative", zIndex: 10 }}>
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" style={{ maxHeight: "80px", marginBottom: "16px" }} />
                    ) : (
                      <FileUp style={{ width: "56px", height: "56px", color: "var(--cyan-glow)", marginBottom: "20px", filter: "drop-shadow(0 0 12px rgba(0,240,255,0.8))" }} />
                    )}
                    <p style={{ fontSize: "1.1rem", color: "white", fontWeight: 500, marginBottom: "8px" }}>
                      {formData.logoUrl ? 'Logo uploaded!' : 'Upload Logo'}
                    </p>
                    <p style={{ color: "#8b8e98", fontSize: "0.85rem", maxWidth: "220px", textAlign: "center", marginBottom: "32px", lineHeight: 1.6 }}>
                      {formData.logoUrl ? 'Click to change' : <>Drop your logo here or browse<br/>[PNG, SVG, JPG. Max 5MB]</>}
                    </p>
                    {!formData.logoUrl && <button className="upload-btn">Upload Logo</button>}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => e.target.files?.[0] && extractColor(e.target.files[0])}
                  />
                </div>

                {/* Extracted color feedback */}
                {extracting && (
                  <p style={{ color: "var(--cyan-glow)", marginTop: "16px", fontSize: "0.85rem", animation: "pulse 1.5s ease-in-out infinite" }}>
                    Analyzing brand palette...
                  </p>
                )}
                {formData.extractedColor && !extracting && formData.logoUrl && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "6px", backgroundColor: formData.extractedColor, border: "1px solid rgba(255,255,255,0.2)" }}></div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "#a1a3ab" }}>
                      Brand color detected: <span style={{ color: "var(--cyan-glow)", textTransform: "uppercase" }}>{formData.extractedColor}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Column 3: Color Palette */}
              <div>
                <h3 style={{ color: "#8b8e98", fontSize: "0.8rem", fontWeight: 600, marginBottom: "20px", paddingLeft: "8px", letterSpacing: "0.5px" }}>Color Palette</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setFormData(prev => ({ ...prev, activeColor: c.id }))}
                      className={`color-btn ${formData.activeColor === c.id ? 'active' : ''}`}
                    >
                      <div className="color-swatch" style={{ backgroundColor: c.color, border: "1px solid #2a2d36" }}></div>
                      {c.id}
                    </button>
                  ))}
                </div>

                <h3 style={{ color: "#8b8e98", fontSize: "0.8rem", fontWeight: 600, marginBottom: "20px", paddingLeft: "8px", letterSpacing: "0.5px" }}>Typography</h3>
                <div style={{ color: "#8b8e98", fontSize: "0.85rem", padding: "20px", background: "#14151a", border: "1px solid #1f222e", borderRadius: "12px" }}>
                  Auto-selected based on industry
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============ STEP 4: CONTENT / MOOD ============ */}
        {step === 4 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-white mb-3 leading-tight text-balance">
                Step 4: Define your content
              </h2>
              <p className="text-[#8b8e98] text-base text-balance">Tell us about your brand and choose a personality.</p>
            </div>

            {/* Business Name */}
            <div style={{ maxWidth: "500px", margin: "0 auto 48px" }}>
              <label style={{ display: "block", color: "#8b8e98", fontSize: "0.8rem", fontWeight: 600, marginBottom: "12px", letterSpacing: "0.5px" }}>Business Name</label>
              <input
                type="text"
                placeholder='e.g. "Zenith Wellness Group"'
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                style={{
                  width: "100%", padding: "16px 20px",
                  background: "#14151a", border: "1px solid #1f222e",
                  borderRadius: "12px", color: "white", fontSize: "1rem",
                  outline: "none", fontFamily: "inherit",
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--cyan-glow)'}
                onBlur={(e) => e.target.style.borderColor = '#1f222e'}
              />
            </div>

            {/* Mood Selector */}
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <label style={{ display: "block", color: "#8b8e98", fontSize: "0.8rem", fontWeight: 600, marginBottom: "20px", letterSpacing: "0.5px" }}>Content Personality</label>
              <div style={{ display: "grid", gap: "16px" }} className="grid-cols-1 sm:grid-cols-3">
                {moods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setFormData(prev => ({ ...prev, mood: m.id }))}
                    className="industry-btn cursor-pointer"
                    style={{
                      flexDirection: "column", alignItems: "flex-start", padding: "24px",
                      borderColor: formData.mood === m.id ? 'var(--cyan-glow)' : '#1f222e',
                      background: formData.mood === m.id ? 'rgba(0, 240, 255, 0.03)' : '#14151a',
                      boxShadow: formData.mood === m.id ? '0 0 15px rgba(0, 240, 255, 0.1) inset' : 'none',
                    }}
                  >
                    <span style={{ fontSize: "1rem", fontWeight: 600, color: formData.mood === m.id ? "var(--cyan-glow)" : "#a1a3ab", marginBottom: "8px", display: "block" }}>{m.label}</span>
                    <span style={{ fontSize: "0.8rem", color: "#6b6e78", lineHeight: 1.5 }}>{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============ STEP 5: REVIEW & SUBMIT ============ */}
        {step === 5 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-white mb-3 leading-tight text-balance">
                Step 5: Review & Generate
              </h2>
              <p className="text-[#8b8e98] text-base text-balance">Confirm your choices and enter your email to receive the demo link.</p>
            </div>

            {/* Summary Grid */}
            <div style={{ maxWidth: "600px", margin: "0 auto 48px", display: "grid", gap: "16px" }} className="grid-cols-1 sm:grid-cols-2">
              {[
                { label: 'Goal', value: goals.find(g => g.id === formData.goal)?.label || '—' },
                { label: 'Layout', value: layouts.find(l => l.id === formData.layout)?.label || '—' },
                { label: 'Industry', value: formData.industry || '—' },
                { label: 'Color', value: formData.activeColor || '—' },
                { label: 'Personality', value: moods.find(m => m.id === formData.mood)?.label || '—' },
                { label: 'Business', value: formData.businessName || '—' },
              ].map((item) => (
                <div key={item.label} style={{ background: "#14151a", border: "1px solid #1f222e", borderRadius: "12px", padding: "16px 20px" }}>
                  <div style={{ fontSize: "0.75rem", color: "#6b6e78", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>{item.label}</div>
                  <div style={{ fontSize: "1rem", color: "white", fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Email Input */}
            <div style={{ maxWidth: "500px", margin: "0 auto" }}>
              <label style={{ display: "block", color: "#8b8e98", fontSize: "0.8rem", fontWeight: 600, marginBottom: "12px", letterSpacing: "0.5px" }}>Email Address</label>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Mail style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: "#6b6e78" }} />
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    style={{
                      width: "100%", padding: "16px 20px 16px 48px",
                      background: "#14151a", border: "1px solid #1f222e",
                      borderRadius: "12px", color: "white", fontSize: "1rem",
                      outline: "none", fontFamily: "inherit",
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--cyan-glow)'}
                    onBlur={(e) => e.target.style.borderColor = '#1f222e'}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ NAVIGATION BUTTONS ============ */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px", borderTop: "1px solid #1f222e", paddingTop: "20px" }}>
          <button
            onClick={handleBack}
            className="appearance-none outline-none border-none cursor-pointer"
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              color: step === 1 ? "#3a3d46" : "#a1a3ab",
              background: "transparent", fontSize: "0.9rem", fontWeight: 500,
              pointerEvents: step === 1 ? "none" : "auto",
              fontFamily: "inherit",
            }}
          >
            <ArrowLeft style={{ width: "16px", height: "16px" }} /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="btn-cyan cursor-pointer"
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              opacity: canProceed() ? 1 : 0.4,
              pointerEvents: canProceed() ? "auto" : "none",
              fontSize: "0.95rem",
            }}
          >
            {step === 5 ? (
              <><Sparkles style={{ width: "16px", height: "16px" }} /> Generate My Website</>
            ) : (
              <>Next <ArrowRight style={{ width: "16px", height: "16px" }} /></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
