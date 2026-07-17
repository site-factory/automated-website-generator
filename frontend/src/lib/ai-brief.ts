type AiBrief = {
  businessName: string;
  industry: string;
  templateStyle: string;
  mood: string;
  paletteName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgTint: string;
  businessPhone?: string;
  businessEmail?: string;
  businessLocation?: string;
};

type ProviderResult = {
  provider: string;
  brief: AiBrief;
};

const supportedIndustries = new Set([
  'Medical',
  'Fashion',
  'Indian Ethnic Wear',
  'Women Hosiery',
  'Kids Wear',
  'Tech',
  'Food',
  'Education',
  'Construction',
  'Interior',
  'Hospital',
  'Agency',
  'Ecommerce',
  'Dairy',
  'Real Estate',
  'Restaurant',
  'Social Service',
  'Beauty',
  'Temple',
  'Professional',
]);

const supportedStyles = new Set(['v1', 'v2', 'v3', 'v4', 'v5', 'v6']);
const supportedMoods = new Set(['visionary', 'authority', 'friendly']);

const palettes = [
  { name: 'Ocean Professional', colors: ['#1565C0', '#0097A7', '#26C6DA', '#E3F2FD'] },
  { name: 'Forest & Earth', colors: ['#2E7D32', '#558B2F', '#F9A825', '#F1F8E9'] },
  { name: 'Sunset Warm', colors: ['#E64A19', '#F57C00', '#FDD835', '#FFF3E0'] },
  { name: 'Royal Purple', colors: ['#6A1B9A', '#8E24AA', '#CE93D8', '#F3E5F5'] },
  { name: 'Corporate Steel', colors: ['#1A237E', '#283593', '#42A5F5', '#E8EAF6'] },
  { name: 'Rose & Gold', colors: ['#C2185B', '#E91E63', '#F9A825', '#FCE4EC'] },
  { name: 'Midnight Dark', colors: ['#212121', '#37474F', '#00BCD4', '#263238'] },
  { name: 'Tropical Vivid', colors: ['#00897B', '#43A047', '#FFD600', '#E0F2F1'] },
  { name: 'Sage & Mint', colors: ['#558B6E', '#80CBC4', '#A5D6A7', '#F0FBF5'] },
  { name: 'Crimson Bold', colors: ['#B71C1C', '#D32F2F', '#FF7043', '#FFEBEE'] },
  { name: 'Golden Hour', colors: ['#F57F17', '#FFA000', '#FFD54F', '#FFFDE7'] },
  { name: 'Arctic Cool', colors: ['#0288D1', '#26C6DA', '#B2EBF2', '#E1F5FE'] },
];

const defaultPalette = palettes[0];

function buildPrompt(userPrompt: string) {
  return `Convert this business description into JSON for a website demo generator.

Description:
${userPrompt}

Return only JSON with this exact shape:
{
  "businessName": "string",
  "industry": "Medical|Fashion|Indian Ethnic Wear|Women Hosiery|Kids Wear|Tech|Food|Education|Construction|Interior|Hospital|Agency|Ecommerce|Dairy|Real Estate|Restaurant|Social Service|Beauty|Temple|Professional",
  "templateStyle": "v1|v2|v3|v4|v5|v6",
  "mood": "visionary|authority|friendly",
  "paletteName": "Ocean Professional|Forest & Earth|Sunset Warm|Royal Purple|Corporate Steel|Rose & Gold|Midnight Dark|Tropical Vivid|Sage & Mint|Crimson Bold|Golden Hour|Arctic Cool",
  "primaryColor": "#RRGGBB",
  "secondaryColor": "#RRGGBB",
  "accentColor": "#RRGGBB",
  "bgTint": "#RRGGBB",
  "businessPhone": "optional string",
  "businessEmail": "optional string",
  "businessLocation": "optional string"
}

Rules:
- Pick the closest supported industry. Use Indian Ethnic Wear for sarees, lehengas, kurtis, salwar suits, and ethnic dresses.
- Use Women Hosiery for hosiery, leggings, shapewear, camisoles, socks, innerwear, and women's daily essentials.
- Use Kids Wear for children's clothing, kidswear, baby clothes, party outfits, and age-wise kids collections.
- Use Beauty for salons, parlors, hair, makeup, spa, grooming, and bridal beauty.
- Pick Restaurant for cafes and dining.
- Pick Professional if nothing fits.
- Pick v6 for visually premium businesses, v3 for enquiry-heavy businesses, v4 for energetic landing pages, v1 for simple local businesses.
- Do not invent phone/email/location unless present in the description.
- Use concise realistic values.`;
}

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return JSON.parse(trimmed);

  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Provider did not return JSON');
  return JSON.parse(match[0]);
}

function sanitizeText(value: unknown, fallback = '') {
  return String(value || fallback).trim().replace(/[<>]/g, '').slice(0, 160);
}

function isHex(value: unknown) {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}

function normalizeIndustry(value: unknown) {
  const text = sanitizeText(value, 'Professional').toLowerCase();
  const aliases: Record<string, string> = {
    medical: 'Medical',
    clinic: 'Medical',
    hospital: 'Hospital',
    doctor: 'Hospital',
    healthcare: 'Hospital',
    fashion: 'Fashion',
    boutique: 'Fashion',
    'indian ethnic wear': 'Indian Ethnic Wear',
    'ethnic wear': 'Indian Ethnic Wear',
    'ethnic dresses': 'Indian Ethnic Wear',
    'indian ethnic dresses': 'Indian Ethnic Wear',
    saree: 'Indian Ethnic Wear',
    sarees: 'Indian Ethnic Wear',
    lehenga: 'Indian Ethnic Wear',
    lehengas: 'Indian Ethnic Wear',
    kurti: 'Indian Ethnic Wear',
    kurtis: 'Indian Ethnic Wear',
    salwar: 'Indian Ethnic Wear',
    'salwar suit': 'Indian Ethnic Wear',
    'women hosiery': 'Women Hosiery',
    "women's hosiery": 'Women Hosiery',
    'womens hosiery': 'Women Hosiery',
    hosiery: 'Women Hosiery',
    leggings: 'Women Hosiery',
    shapewear: 'Women Hosiery',
    innerwear: 'Women Hosiery',
    camisole: 'Women Hosiery',
    socks: 'Women Hosiery',
    'kids wear': 'Kids Wear',
    kidswear: 'Kids Wear',
    'kids clothing': 'Kids Wear',
    'children clothing': 'Kids Wear',
    "children's clothing": 'Kids Wear',
    'child wear': 'Kids Wear',
    'baby clothes': 'Kids Wear',
    tech: 'Tech',
    portfolio: 'Tech',
    food: 'Food',
    cafe: 'Food',
    restaurant: 'Restaurant',
    school: 'Education',
    education: 'Education',
    college: 'Education',
    construction: 'Construction',
    interior: 'Interior',
    agency: 'Agency',
    ecommerce: 'Ecommerce',
    'e-commerce': 'Ecommerce',
    dairy: 'Dairy',
    'real estate': 'Real Estate',
    property: 'Real Estate',
    ngo: 'Social Service',
    charity: 'Social Service',
    temple: 'Temple',
    beauty: 'Beauty',
    salon: 'Beauty',
    spa: 'Beauty',
    parlor: 'Beauty',
    parlour: 'Beauty',
    professional: 'Professional',
  };

  const exact = Array.from(supportedIndustries).find((industry) => industry.toLowerCase() === text);
  return exact || aliases[text] || 'Professional';
}

function normalizePalette(raw: Record<string, unknown>) {
  const palette = palettes.find((item) => item.name.toLowerCase() === sanitizeText(raw.paletteName).toLowerCase())
    || defaultPalette;

  return {
    paletteName: palette.name,
    primaryColor: isHex(raw.primaryColor) ? String(raw.primaryColor) : palette.colors[0],
    secondaryColor: isHex(raw.secondaryColor) ? String(raw.secondaryColor) : palette.colors[1],
    accentColor: isHex(raw.accentColor) ? String(raw.accentColor) : palette.colors[2],
    bgTint: isHex(raw.bgTint) ? String(raw.bgTint) : palette.colors[3],
  };
}

function normalizeBrief(raw: unknown): AiBrief {
  const data = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
  const palette = normalizePalette(data);
  const style = sanitizeText(data.templateStyle, 'v1');
  const mood = sanitizeText(data.mood, 'friendly');

  return {
    businessName: sanitizeText(data.businessName, 'Demo Website'),
    industry: normalizeIndustry(data.industry),
    templateStyle: supportedStyles.has(style) ? style : 'v1',
    mood: supportedMoods.has(mood) ? mood : 'friendly',
    ...palette,
    ...(data.businessPhone ? { businessPhone: sanitizeText(data.businessPhone) } : {}),
    ...(data.businessEmail ? { businessEmail: sanitizeText(data.businessEmail) } : {}),
    ...(data.businessLocation ? { businessLocation: sanitizeText(data.businessLocation) } : {}),
  };
}

async function parseOpenAiCompatibleResponse(res: Response) {
  if (!res.ok) {
    throw new Error(`${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('Provider response did not include message content');
  }
  return normalizeBrief(extractJson(content));
}

async function tryOpenRouter(prompt: string): Promise<ProviderResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not configured');

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-sitespark.local',
      'X-Title': 'Teadustech SiteSpark',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'openrouter/free',
      messages: [
        { role: 'system', content: 'You are a strict JSON generator for website demo brief data.' },
        { role: 'user', content: buildPrompt(prompt) },
      ],
      temperature: 0.2,
    }),
  });

  return { provider: 'openrouter', brief: await parseOpenAiCompatibleResponse(res) };
}

async function tryGemini(prompt: string): Promise<ProviderResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: buildPrompt(prompt) }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content || typeof content !== 'string') {
    throw new Error('Gemini response did not include text content');
  }

  return { provider: 'gemini', brief: normalizeBrief(extractJson(content)) };
}

async function tryGroq(prompt: string): Promise<ProviderResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not configured');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are a strict JSON generator for website demo brief data.' },
        { role: 'user', content: buildPrompt(prompt) },
      ],
      temperature: 0.2,
    }),
  });

  return { provider: 'groq', brief: await parseOpenAiCompatibleResponse(res) };
}

export async function generateAiBrief(prompt: string) {
  const mode = process.env.AI_PROVIDER_MODE || 'free-fallback';
  const providers = mode === 'free-fallback'
    ? [
        { name: 'openrouter', run: tryOpenRouter },
        { name: 'gemini', run: tryGemini },
        { name: 'groq', run: tryGroq },
      ]
    : [
        { name: 'openrouter', run: tryOpenRouter },
        { name: 'gemini', run: tryGemini },
        { name: 'groq', run: tryGroq },
      ];
  const failures: Array<{ provider: string; error: string }> = [];

  for (const provider of providers) {
    try {
      return await provider.run(prompt);
    } catch (error) {
      failures.push({
        provider: provider.name,
        error: error instanceof Error ? error.message : 'Unknown provider error',
      });
    }
  }

  return { provider: null, brief: null, failures };
}

export type { AiBrief };
