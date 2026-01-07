import fs from 'fs';
import JSZip from 'jszip';
import path from 'path';

const filePath = '/Users/oldmanocavson/Library/Mobile Documents/iCloud~com~apple~iBooks/Documents/A Dash of Trouble.epub';

async function reproduce() {
    console.log(`Trying to read: ${filePath}`);

    try {
        const fileContent = fs.readFileSync(filePath);
        const zip = new JSZip();
        const contents = await zip.loadAsync(fileContent);

        console.log("Zip loaded. Iterating...");

        const filePromises = [];
        const newZip = new JSZip();

        contents.forEach((relativePath, zipEntry) => {
            if (zipEntry.dir) {
                console.log(`Skipping directory: ${relativePath}`);
                return;
            }

            console.log(`Processing: ${relativePath}`);
            filePromises.push(async () => {
                try {
                    const content = await zipEntry.async('nodebuffer'); // usage for node
                    console.log(`Read success: ${relativePath}`);
                    newZip.file(relativePath, content);
                } catch (err) {
                    console.error(`FAILED to read ${relativePath}:`, err);
                }
            });
        });

        await Promise.all(filePromises);
        console.log("Done.");

    } catch (err) {
        console.error("Top level error:", err);
    }
}

reproduce();
