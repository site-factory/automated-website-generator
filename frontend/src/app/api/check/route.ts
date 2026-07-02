import { NextResponse } from 'next/server';

const GITHUB_ORG = process.env.GITHUB_ORG || 'site-factory';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function githubHeaders() {
  return {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function repoNameFromPagesUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('github.io')) return null;
    return parsed.pathname.split('/').filter(Boolean)[0] || null;
  } catch {
    return null;
  }
}

async function requestPagesRebuild(repoName: string) {
  if (!GITHUB_TOKEN) return { requested: false, reason: 'missing_github_token' };

  const latestRes = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${repoName}/pages/builds/latest`, {
    headers: githubHeaders(),
    cache: 'no-store',
  });

  if (!latestRes.ok) {
    return { requested: false, reason: `latest_build_${latestRes.status}` };
  }

  const latestBuild = await latestRes.json();
  const status = String(latestBuild.status || '').toLowerCase();
  const errorMessage = latestBuild.error?.message ? String(latestBuild.error.message) : null;
  const failed = ['errored', 'error', 'failed', 'failure'].includes(status) || Boolean(errorMessage);

  if (!failed) {
    return { requested: false, reason: status || 'build_not_failed' };
  }

  const rebuildRes = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${repoName}/pages/builds`, {
    method: 'POST',
    headers: githubHeaders(),
  });

  return {
    requested: rebuildRes.status === 201,
    reason: rebuildRes.status === 201 ? 'queued' : `rebuild_${rebuildRes.status}`,
    latestStatus: status,
    errorMessage,
  };
}

export async function POST(request: Request) {
  try {
    const { url, repoName, retryFailedBuild } = await request.json();
    
    // Fetch the URL to see if GitHub Pages has finished building it
    const res = await fetch(url, { cache: 'no-store' });
    
    // GitHub Pages returns 404 while it's building. Once it's live, it returns 200.
    if (res.status === 200) {
      return NextResponse.json({ live: true });
    }

    const resolvedRepoName = repoName || repoNameFromPagesUrl(url);
    if (retryFailedBuild && resolvedRepoName) {
      const rebuild = await requestPagesRebuild(resolvedRepoName);
      return NextResponse.json({ live: false, status: res.status, rebuild });
    }
    
    return NextResponse.json({ live: false, status: res.status });
  } catch (error) {
    return NextResponse.json({ live: false, error: error instanceof Error ? error.message : 'Unknown check failure' });
  }
}
