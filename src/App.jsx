import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import Footer from './components/Footer';
import Dropzone from './components/Dropzone';
import FileList from './components/FileList';
import { processEpub } from './utils/epubProcessor';

function App() {
  const [files, setFiles] = useState([]);

  const processFile = async (fileId, file) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'processing' } : f));

    // Small delay to show processing state
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = await processEpub(file);

    setFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        if (result.success) {
          return {
            ...f,
            status: 'success',
            result: result.data,
            removedCount: result.removedCount
          };
        } else {
          return {
            ...f,
            status: 'error',
            error: result.error
          };
        }
      }
      return f;
    }));
  };

  const handleFilesAdded = useCallback((newFiles) => {
    const newFileEntries = newFiles.map(file => ({
      id: uuidv4(),
      file,
      originalName: file.name,
      status: 'queued', // queued, processing, success, error
      result: null,
      error: null
    }));

    setFiles(prev => [...prev, ...newFileEntries]);

    // Process immediately
    newFileEntries.forEach(entry => {
      processFile(entry.id, entry.file);
    });
  }, []);

  const handleRemove = (name) => {
    setFiles(prev => prev.filter(f => f.originalName !== name));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans selection:bg-blue-500/30">
      <Header />

      <main className="container mx-auto px-4 py-12 flex-1 flex flex-col items-center max-w-3xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Fix <span className="text-blue-400">Apple Books</span> EPUBs
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Drag and drop multiple files to remove iTunes metadata and make them compatible with all e-readers.
          </p>
        </div>

        <Dropzone onFilesAdded={handleFilesAdded} />

        <FileList files={files} onRemove={handleRemove} />

      </main>

      <Footer />
    </div>
  );
}

export default App;
