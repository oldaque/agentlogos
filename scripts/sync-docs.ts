import { readdir, mkdir, copyFile, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { existsSync } from "node:fs";

const SOURCE_DIR = "docs";
const DEST_DIR = "src/content/docs";

async function copyDir(src: string, dest: string) {
    const entries = await readdir(src, { withFileTypes: true });

    await mkdir(dest, { recursive: true });

    for (const entry of entries) {
        const srcPath = join(src, entry.name);
        const destPath = join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
            await copyFile(srcPath, destPath);
        }
    }
}

async function syncDocs() {
    console.log(`Syncing docs from ${SOURCE_DIR} to ${DEST_DIR}...`);

    if (existsSync(DEST_DIR)) {
        await rm(DEST_DIR, { recursive: true, force: true });
    }

    if (!existsSync(SOURCE_DIR)) {
        console.warn(`Source directory ${SOURCE_DIR} does not exist. creating it.`);
        await mkdir(SOURCE_DIR, { recursive: true });
        return;
    }

    await copyDir(SOURCE_DIR, DEST_DIR);
    console.log("Docs synced successfully.");
}

syncDocs().catch(console.error);
