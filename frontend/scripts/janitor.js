const RETENTION_DAYS = Number(process.env.RETENTION_DAYS || 30);
const GITHUB_ORG = process.env.GITHUB_ORG || 'site-factory';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GENERATED_REPO_TOPIC = 'aisitespark-demo';

function assertConfig() {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Supabase config is required for janitor cleanup');
    }
    if (!GITHUB_TOKEN) {
        throw new Error('GITHUB_TOKEN is required for janitor cleanup');
    }
}

async function fetchExpiredLeads() {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const query = new URLSearchParams({
        select: 'id,status,github_repo_name,github_repo_id,created_at,cleanup_status',
        status: 'neq.converted',
        created_at: `lt.${cutoff}`,
        github_repo_name: 'not.is.null',
        cleanup_status: 'eq.active',
    });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads?${query.toString()}`, {
        headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch expired leads: ${res.status} ${await res.text()}`);
    }

    return res.json();
}

async function supabasePatchLead(id, patch) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...patch,
            updated_at: new Date().toISOString(),
        }),
    });

    if (!res.ok) {
        throw new Error(`Failed to update lead ${id}: ${res.status} ${await res.text()}`);
    }
}

function githubHeaders() {
    return {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    };
}

async function fetchRepo(repoName) {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${repoName}`, {
        headers: githubHeaders(),
    });

    if (res.status === 404) return null;
    if (!res.ok) {
        throw new Error(`GitHub repo lookup failed for ${repoName}: ${res.status} ${await res.text()}`);
    }

    return res.json();
}

async function fetchRepoTopics(repoName) {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${repoName}/topics`, {
        headers: githubHeaders(),
    });

    if (!res.ok) {
        throw new Error(`GitHub topic lookup failed for ${repoName}: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    return Array.isArray(data.names) ? data.names : [];
}

async function deleteRepo(repoName) {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${repoName}`, {
        method: 'DELETE',
        headers: githubHeaders(),
    });

    if (res.status === 204) return 'deleted';
    if (res.status === 404) return 'missing';
    throw new Error(`GitHub delete failed for ${repoName}: ${res.status} ${await res.text()}`);
}

async function cleanupLead(lead) {
    const repoName = lead.github_repo_name;
    const expectedRepoId = Number(lead.github_repo_id);

    if (!expectedRepoId) {
        await supabasePatchLead(lead.id, { cleanup_status: 'skipped' });
        return { status: 'skipped', reason: 'missing github_repo_id', repoName };
    }

    const repo = await fetchRepo(repoName);
    if (!repo) {
        await supabasePatchLead(lead.id, { cleanup_status: 'skipped' });
        return { status: 'skipped', reason: 'repo already missing', repoName };
    }

    if (Number(repo.id) !== expectedRepoId) {
        await supabasePatchLead(lead.id, { cleanup_status: 'skipped' });
        return { status: 'skipped', reason: `repo id mismatch: expected ${expectedRepoId}, found ${repo.id}`, repoName };
    }

    const topics = await fetchRepoTopics(repoName);
    if (!topics.includes(GENERATED_REPO_TOPIC)) {
        await supabasePatchLead(lead.id, { cleanup_status: 'skipped' });
        return { status: 'skipped', reason: `missing ${GENERATED_REPO_TOPIC} topic`, repoName };
    }

    const result = await deleteRepo(repoName);
    const now = new Date().toISOString();
    if (result === 'deleted') {
        await supabasePatchLead(lead.id, { cleanup_status: 'deleted', deleted_at: now });
        return { status: 'deleted', reason: 'deleted', repoName };
    }

    await supabasePatchLead(lead.id, { cleanup_status: 'skipped', deleted_at: now });
    return { status: 'skipped', reason: 'repo disappeared before delete', repoName };
}

async function cleanupOldDemos() {
    assertConfig();
    console.log(`Starting janitor cleanup for non-converted demos older than ${RETENTION_DAYS} days...`);

    const leads = await fetchExpiredLeads();
    let deleted = 0;
    let skipped = 0;
    let failed = 0;

    for (const lead of leads) {
        try {
            const result = await cleanupLead(lead);
            if (result.status === 'deleted') {
                deleted++;
                console.log(`[DELETED] ${result.repoName}`);
            } else {
                skipped++;
                console.log(`[SKIPPED] ${result.repoName}: ${result.reason}`);
            }
        } catch (error) {
            failed++;
            try {
                await supabasePatchLead(lead.id, { cleanup_status: 'failed' });
            } catch (updateError) {
                console.error(`[FAILED] Could not mark ${lead.github_repo_name} as failed: ${updateError.message}`);
            }
            console.error(`[FAILED] ${lead.github_repo_name}: ${error.message}`);
        }
    }

    console.log(`Cleanup complete. Deleted: ${deleted}, skipped: ${skipped}, failed: ${failed}.`);
}

if (require.main === module) {
    cleanupOldDemos().catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    });
}

module.exports = { cleanupOldDemos, fetchExpiredLeads, fetchRepo, fetchRepoTopics, deleteRepo, cleanupLead };
