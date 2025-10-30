import React, { useRef, useState } from 'react';
import { FileUp, Receipt, FileSpreadsheet, FileText, UploadCloud, Trash2 } from 'lucide-react';

export default function UploadSection() {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const onPick = () => inputRef.current?.click();

  const onFilesSelected = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      const deduped = picked.filter((f) => !names.has(f.name));
      return [...prev, ...deduped];
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const removeFile = (name) => setFiles((prev) => prev.filter((f) => f.name !== name));

  return (
    <section id="upload" className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-geist text-2xl font-semibold text-white">Upload your tax documents</h2>
            <p className="mt-1 text-sm text-slate-300">Form 16, 26AS, rent receipts, investment proofs. Multiple files supported.</p>
          </div>
          <button
            onClick={onPick}
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 sm:mt-0"
          >
            <UploadCloud className="h-4 w-4" /> Choose files
          </button>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx,.xls"
            onChange={onFilesSelected}
          />
        </div>

        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-slate-300"
        >
          <div className="flex flex-col items-center justify-center text-center">
            <FileUp className="h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm">Drag & drop files here, or use the button above</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2 py-1"><Receipt className="h-3 w-3" /> Form 16</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2 py-1"><FileSpreadsheet className="h-3 w-3" /> 26AS/Bank</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2 py-1"><FileText className="h-3 w-3" /> Proofs</span>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-200">Selected files</h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {files.map((f) => (
                <li key={f.name} className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="h-4 w-4 flex-none text-slate-400" />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-white">{f.name}</p>
                      <p className="truncate text-xs text-slate-400">{(f.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(f.name)}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
                    aria-label={`Remove ${f.name}`}
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xs text-slate-400">
              Note: This demo collects files locally for preview. Connect the AI backend to process with Gemini.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
