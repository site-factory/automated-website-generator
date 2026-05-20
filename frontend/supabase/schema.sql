create type public.lead_status as enum ('new', 'contacted', 'converted', 'archived');

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  business_name text not null,
  industry text not null,
  template_style text not null,
  mood text not null,
  palette_name text not null,
  primary_color text not null,
  secondary_color text not null,
  accent_color text not null,
  bg_tint text not null,
  demo_id text,
  demo_url text,
  github_repo_url text,
  github_repo_name text,
  github_repo_id bigint,
  cleanup_status text not null default 'active',
  deleted_at timestamptz,
  notes text,
  status public.lead_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint leads_cleanup_status_check
    check (cleanup_status in ('active', 'deleted', 'skipped', 'failed'))
);

create index if not exists leads_status_created_at_idx
  on public.leads (status, created_at);

create index if not exists leads_cleanup_lookup_idx
  on public.leads (status, cleanup_status, created_at);
