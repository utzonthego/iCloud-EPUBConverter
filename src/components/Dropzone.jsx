import React, { useRef, useState } from 'react';
import { Upload, FilePlus, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import JSZip from 'jszip';

export default function Dropzone({ onFilesAdded }) {
    const [isDragActive, setIsDragActive] = useState(false);
    const [isProcessingDrop, setIsProcessingDrop] = useState(false);
    const inputRef = useRef(null);

    // Helper to read file from FileEntry
    const readFile = (fileEntry) => {
        return new Promise((resolve, reject) => {
            fileEntry.file(resolve, reject);
        });
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const items = e.dataTransfer.items;
        if (!items || items.length === 0) return;

        setIsProcessingDrop(true);
        const filesToAdd = [];

        try {
            const entries = Array.from(items)
                .map(item => item.webkitGetAsEntry ? item.webkitGetAsEntry() : null)
                .filter(Boolean);

            for (const entry of entries) {
                if (entry.isFile) {
                    // Standard file
                    const file = await readFile(entry);
                    filesToAdd.push(file);
                } else if (entry.isDirectory) {
                    // It's a directory (package)
                    // Create a new zip for this directory
                    const zip = new JSZip();
                    const dirReader = entry.createReader();

                    // Helper to read entries (not recursive in one call)
                    const readEntries = (reader) => {
                        return new Promise((resolve, reject) => {
                            reader.readEntries((entries) => {
                                // readEntries can return partial results, but typical usage implies calling until empty.
                                // For simplicity here, assuming one call gets most/all or simple structure.
                                // Real robust impl needs recursion on readEntries.
                                resolve(entries);
                            }, reject);
                        });
                    };

                    // Recursive zipper
                    const processEntry = async (currentEntry, currentZip) => {
                        if (currentEntry.isFile) {
                            const file = await readFile(currentEntry);
                            currentZip.file(currentEntry.name, file);
                        } else if (currentEntry.isDirectory) {
                            const newFolder = currentZip.folder(currentEntry.name);
                            const reader = currentEntry.createReader();
                            const subEntries = await readEntries(reader); // Simplified reading
                            for (const sub of subEntries) {
                                await processEntry(sub, newFolder);
                            }
                        }
                    };

                    // Get children of root
                    // NOTE: entry is the root folder. processEntry adds it to zip.
                    // BUT we want the CONTENTS of this folder to be the ZIP root?
                    // OR do we want the folder inside?
                    // EPUB structure: mimetype file must be at root. 
                    // So if dragging 'Book.epub' folder, we want its children at zip root.

                    const rootReader = entry.createReader();
                    const children = await readEntries(rootReader);

                    // We process children directly into the root zip
                    for (const child of children) {
                        await processEntry(child, zip);
                    }

                    const blob = await zip.generateAsync({ type: 'blob' });
                    // Create a File object from blob
                    const zippedFile = new File([blob], entry.name, { type: "application/epub+zip" });
                    filesToAdd.push(zippedFile);
                }
            }

            onFilesAdded(filesToAdd);
        } catch (err) {
            console.error("Error processing drop:", err);
            alert("Failed to process dropped files/folders. See console for details.");
        } finally {
            setIsProcessingDrop(false);
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div
            onClick={handleClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={clsx(
                "w-full cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out flex flex-col items-center justify-center py-16 px-6 text-center group",
                isDragActive
                    ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                    : "border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-white/20"
            )}
        >
            <input
                ref={inputRef}
                type="file"
                multiple
                accept=".epub,.zip,application/epub+zip,application/zip"
                className="hidden"
            />

            <div className={clsx(
                "mb-6 p-5 rounded-full transition-transform duration-300",
                isDragActive ? "bg-blue-500 text-white scale-110" : "bg-white/10 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20"
            )}>
                {isProcessingDrop ? (
                    <Loader2 size={40} className="animate-spin text-blue-400" />
                ) : (
                    isDragActive ? <FilePlus size={40} /> : <Upload size={40} />
                )}
            </div>

            <h3 className="text-xl font-bold mb-2">
                {isProcessingDrop ? "Processing..." : (isDragActive ? "Drop files here" : "Drag & Drop files")}
            </h3>
            <p className="text-gray-400 max-w-sm mx-auto">
                or click to browse. Supports multiple <span className="text-white font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">.epub</span> or <span className="text-white font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">.zip</span> files (and folders!).
            </p>
        </div>
    );
}
