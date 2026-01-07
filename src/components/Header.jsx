import React from 'react';
import { BookOpen } from 'lucide-react';

export default function Header() {
    return (
        <header className="py-6 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-10">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
                        <BookOpen size={24} />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        EPUB Fixer <span className="text-xs text-blue-500/60 font-mono ml-2 border border-blue-500/20 px-1.5 py-0.5 rounded bg-blue-500/10 align-middle">v1.0.1</span>
                    </h1>
                </div>
                <div className="text-sm text-gray-400 font-medium">
                    Batch Processor
                </div>
            </div>
        </header>
    );
}
