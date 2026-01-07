import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FileItem from './FileItem';
import { DownloadCloud } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function FileList({ files, onRemove }) {
    if (files.length === 0) return null;

    const handleDownloadAll = async () => {
        const successFiles = files.filter(f => f.status === 'success' && f.result);
        if (successFiles.length === 0) return;

        if (successFiles.length === 1) {
            saveAs(successFiles[0].result, `fixed_${successFiles[0].originalName}`);
        } else {
            // Zip them all
            const zip = new JSZip();
            successFiles.forEach(f => {
                zip.file(`fixed_${f.originalName}`, f.result);
            });
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'fixed_epubs_batch.zip');
        }
    };

    const hasSuccess = files.some(f => f.status === 'success');

    return (
        <div className="w-full mt-8 space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-semibold text-gray-300">Queue ({files.length})</h3>
                {hasSuccess && (
                    <button
                        onClick={handleDownloadAll}
                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
                    >
                        <DownloadCloud size={16} />
                        Download All
                    </button>
                )}
            </div>

            <div className="space-y-3">
                <AnimatePresence initial={false}>
                    {files.map((file) => (
                        <motion.div
                            key={file.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <FileItem fileData={file} onRemove={onRemove} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
