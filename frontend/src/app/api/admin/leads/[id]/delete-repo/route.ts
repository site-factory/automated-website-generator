import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getLead, updateLeadAdmin } from '@/lib/supabase';

const GITHUB_ORG = process.env.GITHUB_ORG || 'site-factory';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GENERATED_REPO_TOPIC = 'aisitespark-demo';

function githubHeaders() {
  return {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function fetchRepo(repoName: string) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${repoName}`, {
    headers: githubHeaders(),
    cache: 'no-store',
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub repo lookup failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

async function fetchRepoTopics(repoName: string) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${repoName}/topics`, {
    headers: githubHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`GitHub topic lookup failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return Array.isArray(data.names) ? data.names : [];
}

async function deleteRepo(repoName: string) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${repoName}`, {
    method: 'DELETE',
    headers: githubHeaders(),
  });

  if (res.status === 204) return 'deleted';
  if (res.status === 404) return 'missing';
  throw new Error(`GitHub delete failed: ${res.status} ${await res.text()}`);
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'GITHUB_TOKEN is not configured' }, { status: 500 });
  }

  const { id } = await params;
  const lead = await getLead(id);

  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  if (lead.status === 'converted') {
    return NextResponse.json({ error: 'Converted leads are protected from deletion' }, { status: 409 });
  }

  if (!lead.githubRepoName) {
    return NextResponse.json({ error: 'Lead has no GitHub repo name' }, { status: 400 });
  }

  if (!lead.githubRepoId) {
    return NextResponse.json({ error: 'Lead has no GitHub repo id, so safe deletion is blocked' }, { status: 400 });
  }

  try {
    const repo = await fetchRepo(lead.githubRepoName);
    if (!repo) {
      const updatedLead = await updateLeadAdmin(id, {
        status: 'archived',
        cleanupStatus: 'skipped',
        deletedAt: new Date().toISOString(),
      });
      return NextResponse.json({ lead: updatedLead, result: 'missing' });
    }

    if (Number(repo.id) !== lead.githubRepoId) {
      return NextResponse.json({ error: 'GitHub repo id does not match the lead record' }, { status: 409 });
    }

    const topics = await fetchRepoTopics(lead.githubRepoName);
    if (!topics.includes(GENERATED_REPO_TOPIC)) {
      return NextResponse.json({ error: `Repo is missing required ${GENERATED_REPO_TOPIC} topic` }, { status: 409 });
    }

    const deleteResult = await deleteRepo(lead.githubRepoName);
    const updatedLead = await updateLeadAdmin(id, {
      status: 'archived',
      cleanupStatus: deleteResult === 'deleted' ? 'deleted' : 'skipped',
      deletedAt: new Date().toISOString(),
    });

    return NextResponse.json({ lead: updatedLead, result: deleteResult });
  } catch (error) {
    await updateLeadAdmin(id, { cleanupStatus: 'failed' });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete repo' },
      { status: 500 },
    );
  }
}
