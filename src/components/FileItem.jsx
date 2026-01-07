import React from 'react';
import { FileText, CheckCircle, Loader2, AlertCircle, Download, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { saveAs } from 'file-saver';

export default function FileItem({ fileData, onRemove }) {
    const { originalName, status, result, error, removedCount } = fileData;

    const handleDownload = () => {
        if (result && status === 'success') {
            saveAs(result, `fixed_${originalName}`);
        }
    };

    return (
        <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:bg-white/[0.07] transition-colors">
            <div className="flex items-center gap-4 overflow-hidden">
                <div className={clsx("p-2.5 rounded-lg shrink-0",
                    status === 'success' ? "bg-green-500/20 text-green-400" :
                        status === 'error' ? "bg-red-500/20 text-red-400" :
                            "bg-blue-500/20 text-blue-400"
                )}>
                    {status === 'processing' && <Loader2 size={20} className="animate-spin" />}
                    {status === 'success' && <CheckCircle size={20} />}
                    {status === 'error' && <AlertCircle size={20} />}
                    {status === 'queued' && <FileText size={20} />}
                </div>

                <div className="min-w-0">
                    <h4 className="font-medium truncate text-white max-w-[200px] md:max-w-xs" title={originalName}>
                        {originalName}
                    </h4>
                    <p className="text-xs text-gray-400">
                        {status === 'queued' && "Waiting..."}
                        {status === 'processing' && "Fixing metadata..."}
                        {status === 'success' && `Fixed! Removed ${removedCount} items.`}
                        {status === 'error' && error}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {status === 'success' && (
                    <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">Download</span>
                    </button>
                )}

                <button
                    onClick={() => onRemove(originalName)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}
