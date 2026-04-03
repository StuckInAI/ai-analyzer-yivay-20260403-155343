'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onAnalyze: (text: string) => void;
}

export default function UploadZone({ onAnalyze }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    setFileError(null);
    const allowedTypes = ['text/plain', 'text/markdown', 'text/csv', 'application/json'];
    const allowedExtensions = ['.txt', '.md', '.csv', '.json', '.text'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setFileError('Unsupported file type. Please upload a .txt, .md, .csv, or .json file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError('File is too large. Maximum size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setUploadedFile(file);
      setFileContent(content);
    };
    reader.onerror = () => {
      setFileError('Failed to read file. Please try again.');
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0]) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleRemove = useCallback(() => {
    setUploadedFile(null);
    setFileContent('');
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5">
        {!uploadedFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.csv,.json,.text"
              onChange={handleFileInput}
              className="hidden"
            />
            <Upload className={`w-12 h-12 mx-auto mb-4 ${
              isDragging ? 'text-indigo-500' : 'text-slate-400'
            }`} />
            <p className="text-lg font-medium text-slate-700 mb-2">
              {isDragging ? 'Drop your file here' : 'Drag & drop your file'}
            </p>
            <p className="text-sm text-slate-500 mb-4">
              or click to browse
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['.txt', '.md', '.csv', '.json'].map(ext => (
                <span key={ext} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-mono">
                  {ext}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">Maximum file size: 5MB</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <File className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{uploadedFile.name}</p>
                <p className="text-sm text-slate-500">{formatFileSize(uploadedFile.size)}</p>
              </div>
              <button
                onClick={handleRemove}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 max-h-48 overflow-y-auto">
              <p className="text-xs text-slate-500 mb-2 font-medium">File Preview:</p>
              <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                {fileContent.slice(0, 500)}{fileContent.length > 500 ? '...' : ''}
              </pre>
            </div>
          </div>
        )}

        {fileError && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{fileError}</p>
          </div>
        )}
      </div>

      {uploadedFile && !fileError && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => onAnalyze(fileContent)}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Analyze Document
          </button>
        </div>
      )}
    </div>
  );
}
