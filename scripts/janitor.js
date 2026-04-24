const fs = require('fs');
const path = require('path');

const RETENTION_DAYS = 30;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

function cleanupOldDemos() {
    console.log(`Starting cleanup of demos older than ${RETENTION_DAYS} days...`);
    const workingDir = process.cwd().includes('scripts') ? path.join(process.cwd(), '..') : process.cwd();
    const demosDir = path.join(workingDir, 'demos');

    if (!fs.existsSync(demosDir)) {
        console.log('No demos directory found. Exiting.');
        return;
    }

    const now = Date.now();
    const files = fs.readdirSync(demosDir);
    let deletedCount = 0;

    files.forEach(file => {
        const filePath = path.join(demosDir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const ageMs = now - stats.mtimeMs;
            if (ageMs > RETENTION_MS) {
                console.log(`Deleting old demo: ${file}`);
                fs.rmSync(filePath, { recursive: true, force: true });
                deletedCount++;
            }
        }
    });

    console.log(`Cleanup complete. Deleted ${deletedCount} old demo(s).`);
}

// Run if executed directly
if (require.main === module) {
    cleanupOldDemos();
}

module.exports = { cleanupOldDemos };
