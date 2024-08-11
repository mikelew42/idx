// const fs = require('fs').promises;
// const path = require('path');

import fs from "fs/promises";
import path from "path";

async function generateSitemap(directory, basePath = directory) {
    const sitemap = {};
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);
        const relativePath = path.relative(basePath, entryPath);

        if (relativePath !== "node_modules" && entry.isDirectory()) {
            sitemap[relativePath] = await generateSitemap(entryPath, basePath);
        } else {
            sitemap[relativePath] = { /* Add file information here if needed */ };
        }
    }

    return sitemap;
}

async function main() {
    const websiteDirectory = './';
    const sitemap = await generateSitemap(websiteDirectory);

    await fs.writeFile('sitemap.json', JSON.stringify(sitemap, null, 2));
}

main().catch(console.error);
