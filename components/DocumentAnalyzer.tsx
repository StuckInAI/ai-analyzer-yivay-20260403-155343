'use client';

import { useState, useCallback } from 'react';
import UploadZone from './UploadZone';
import TextInput from './TextInput';
import AnalysisResults from './AnalysisResults';
import LoadingState from './LoadingState';
import type { AnalysisResult } from '@/types/analysis';

type InputMode = 'upload' | 'text';

export default function DocumentAnalyzer() {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [textContent, setTextContent] = useState('');

  const handleAnalyze = useCallback(async (text: string) => {
    if (!text.trim()) {
      setError('Please provide some text to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json() as AnalysisResult & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? 'Analysis failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setError(null);
    setTextContent('');
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center py-6">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          Analyze Any Document Instantly
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upload a file or paste text to extract key insights, generate summaries, identify topics, and more.
        </p>
      </div>

      {/* Mode Switcher */}
      {!result && !isAnalyzing && (
        <div className="flex justify-center">
          <div className="bg-white rounded-xl p-1 shadow-sm border border-slate-200 flex gap-1">
            <button
              onClick={() => setInputMode('text')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                inputMode === 'text'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setInputMode('upload')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                inputMode === 'upload'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Upload File
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div>
            <p className="text-red-800 font-medium">Analysis Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Content Area */}
      {isAnalyzing ? (
        <LoadingState />
      ) : result ? (
        <AnalysisResults result={result} onReset={handleReset} />
      ) : (
        <div>
          {inputMode === 'text' ? (
            <TextInput
              value={textContent}
              onChange={setTextContent}
              onAnalyze={handleAnalyze}
            />
          ) : (
            <UploadZone onAnalyze={handleAnalyze} />
          )}
        </div>
      )}

      {/* Feature Cards */}
      {!result && !isAnalyzing && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <FeatureCard
            icon="📊"
            title="Smart Summaries"
            description="Get concise summaries that capture the essence of your documents."
          />
          <FeatureCard
            icon="🔍"
            title="Key Insights"
            description="Extract important insights, themes, and patterns automatically."
          />
          <FeatureCard
            icon="💡"
            title="Action Items"
            description="Identify actionable items and recommendations from your text."
          />
        </div>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}
