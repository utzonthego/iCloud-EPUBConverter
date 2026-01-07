import JSZip from 'jszip';

export async function processEpub(file) {
    try {
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);

        // We will create a new zip for the output
        const newZip = new JSZip();
        let removedCount = 0;

        // Filter files
        const filePromises = [];

        contents.forEach((relativePath, zipEntry) => {
            // Logic from epubconverter.pages.dev:
            // Remove iTunesMetadata.plist and keys starting with __MACOSX
            if (
                relativePath.includes('iTunesMetadata') ||
                relativePath.startsWith('__MACOSX') ||
                relativePath.includes('.DS_Store')
            ) {
                removedCount++;
                return; // Skip this file
            }

            if (zipEntry.dir) {
                // If it's a directory, just create it in the new zip
                // Note: file() with no content might interpret as empty string, folder() is safer
                newZip.folder(relativePath);
                return;
            }

            filePromises.push(async () => {
                try {
                    // Read content and add to new zip
                    const content = await zipEntry.async('arraybuffer');
                    newZip.file(relativePath, content);
                } catch (err) {
                    console.warn(`Failed to read ${relativePath}:`, err);
                    // Don't fail the whole process for one file read error? 
                    // Or maybe we should. But for now, let's log and maybe skip.
                }
            });
        });

        await Promise.all(filePromises.map(f => f()));

        // Generate new blob with high compression
        const blob = await newZip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 9 },
            mimeType: 'application/epub+zip'
        });

        return {
            success: true,
            data: blob,
            originalName: file.name,
            removedCount
        };
    } catch (error) {
        console.error("Processing error:", error);
        return {
            success: false,
            error: error.message || "Unknown error parsing EPUB"
        };
    }
}
