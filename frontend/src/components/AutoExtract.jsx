import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, AlertTriangle } from 'lucide-react';

export default function AutoExtract({ onExtracted, onBack }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const processDocument = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('document', file);

    try {
      // Assuming the backend is running on the same host but we use relative path
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json();
        const errorMessage = errData.details ? `${errData.error} (${errData.details})` : errData.error;
        throw new Error(errorMessage || 'Failed to process document');
      }

      const data = await response.json();
      onExtracted(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during extraction.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="w-full max-w-2xl mx-auto py-20 px-4 text-center animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-8 relative">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin absolute" />
          <FileText className="w-6 h-6 text-emerald-200" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Extracting Information...</h2>
        <p className="text-slate-500 mt-2 text-sm">
          Using Gemini to analyze the document layout, identify text, and structure farmer records.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Upload Document</h1>
        <p className="text-slate-500 mt-2 text-sm">
          Upload a clear PDF or image of the farmer's enrollment slip. We will automatically extract the details.
        </p>
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 ${
          isDragging ? 'border-emerald-500 bg-emerald-50/50 scale-[1.02]' : 
          file ? 'border-slate-300 bg-slate-50' : 
          'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileSelect}
          accept="application/pdf,image/*"
        />

        {!file ? (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 text-slate-400">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-700 font-semibold">Drag & drop your document here</p>
              <p className="text-slate-400 text-xs mt-1">Supports PDF, JPG, PNG (Max 10MB)</p>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-6 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-medium rounded-xl shadow-sm transition-all"
            >
              Browse Files
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-900 font-semibold">{file.name}</p>
              <p className="text-slate-500 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => setFile(null)}
                className="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                Change File
              </button>
              <button 
                onClick={processDocument}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md transition-all"
              >
                Extract Information
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-800 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
          <p>{error}</p>
        </div>
      )}

      <div className="mt-12 text-center">
        <button onClick={onBack} className="text-sm font-medium text-slate-400 hover:text-slate-600">
          ← Back to Options
        </button>
      </div>
    </div>
  );
}
