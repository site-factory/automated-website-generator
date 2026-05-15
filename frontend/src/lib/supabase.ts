type LeadStatus = 'new' | 'contacted' | 'converted' | 'archived';

interface LeadInsertInput {
  email: string;
  businessName: string;
  industry: string;
  templateStyle: string;
  mood: string;
  paletteName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgTint: string;
}

interface LeadRecord extends LeadInsertInput {
  id: string;
  status: LeadStatus;
  demoId: string | null;
  demoUrl: string | null;
  githubRepoUrl: string | null;
  githubRepoName: string | null;
  createdAt: string;
  updatedAt: string;
}

type LeadRow = Record<string, unknown>;

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertSupabaseConfig() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase is not configured');
  }
}

async function supabaseRequest<T>(path: string, init: RequestInit): Promise<T> {
  assertSupabaseConfig();

  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey!,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Supabase request failed: ${res.status} ${await res.text()}`);
  }

  return res.json() as Promise<T>;
}

export async function createLead(input: LeadInsertInput): Promise<LeadRecord> {
  const [lead] = await supabaseRequest<LeadRow[]>('leads', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      email: input.email,
      business_name: input.businessName,
      industry: input.industry,
      template_style: input.templateStyle,
      mood: input.mood,
      palette_name: input.paletteName,
      primary_color: input.primaryColor,
      secondary_color: input.secondaryColor,
      accent_color: input.accentColor,
      bg_tint: input.bgTint,
      status: 'new',
    }),
  });

  return normalizeLead(lead);
}

export async function updateLeadGeneration(
  id: string,
  data: { demoId: string; demoUrl: string | null; githubRepoUrl: string | null; githubRepoName: string | null },
): Promise<LeadRecord> {
  const [lead] = await supabaseRequest<LeadRow[]>(`leads?id=eq.${id}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      demo_id: data.demoId,
      demo_url: data.demoUrl,
      github_repo_url: data.githubRepoUrl,
      github_repo_name: data.githubRepoName,
      updated_at: new Date().toISOString(),
    }),
  });

  return normalizeLead(lead);
}

function normalizeLead(raw: LeadRow): LeadRecord {
  return {
    id: String(raw.id),
    email: String(raw.email),
    businessName: String(raw.business_name),
    industry: String(raw.industry),
    templateStyle: String(raw.template_style),
    mood: String(raw.mood),
    paletteName: String(raw.palette_name),
    primaryColor: String(raw.primary_color),
    secondaryColor: String(raw.secondary_color),
    accentColor: String(raw.accent_color),
    bgTint: String(raw.bg_tint),
    status: raw.status as LeadStatus,
    demoId: raw.demo_id ? String(raw.demo_id) : null,
    demoUrl: raw.demo_url ? String(raw.demo_url) : null,
    githubRepoUrl: raw.github_repo_url ? String(raw.github_repo_url) : null,
    githubRepoName: raw.github_repo_name ? String(raw.github_repo_name) : null,
    createdAt: String(raw.created_at),
    updatedAt: String(raw.updated_at),
  };
}

export type { LeadStatus, LeadRecord };
