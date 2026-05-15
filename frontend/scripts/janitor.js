const RETENTION_DAYS = Number(process.env.RETENTION_DAYS || 30);
const GITHUB_ORG = process.env.GITHUB_ORG || 'site-factory';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

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
        select: 'id,status,github_repo_name,created_at',
        status: 'neq.converted',
        created_at: `lt.${cutoff}`,
        github_repo_name: 'not.is.null',
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

async function deleteRepo(repoName) {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${repoName}`, {
        method: 'DELETE',
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });

    if (res.status === 204) return 'deleted';
    if (res.status === 404) return 'missing';
    throw new Error(`GitHub delete failed for ${repoName}: ${res.status} ${await res.text()}`);
}

async function cleanupOldDemos() {
    assertConfig();
    console.log(`Starting janitor cleanup for non-converted demos older than ${RETENTION_DAYS} days...`);

    const leads = await fetchExpiredLeads();
    let deleted = 0;
    let missing = 0;
    let failed = 0;

    for (const lead of leads) {
        try {
            const result = await deleteRepo(lead.github_repo_name);
            if (result === 'deleted') {
                deleted++;
                console.log(`[DELETED] ${lead.github_repo_name}`);
            } else {
                missing++;
                console.log(`[SKIPPED] ${lead.github_repo_name} was already missing`);
            }
        } catch (error) {
            failed++;
            console.error(`[FAILED] ${lead.github_repo_name}: ${error.message}`);
        }
    }

    console.log(`Cleanup complete. Deleted: ${deleted}, missing: ${missing}, failed: ${failed}.`);
}

if (require.main === module) {
    cleanupOldDemos().catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    });
}

module.exports = { cleanupOldDemos, fetchExpiredLeads, deleteRepo };
