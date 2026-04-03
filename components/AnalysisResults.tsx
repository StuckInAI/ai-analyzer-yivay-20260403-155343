'use client';

import { useState } from 'react';
import {
  RotateCcw,
  FileText,
  Lightbulb,
  Tag,
  TrendingUp,
  Clock,
  Hash,
  CheckSquare,
  Download,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { AnalysisResult } from '@/types/analysis';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

const sentimentConfig = {
  positive: { label: 'Positive', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200', emoji: '😊' },
  neutral: { label: 'Neutral', color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-200', emoji: '😐' },
  negative: { label: 'Negative', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200', emoji: '😟' },
};

const complexityConfig = {
  simple: { label: 'Simple', color: 'text-green-700', bg: 'bg-green-100' },
  moderate: { label: 'Moderate', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  complex: { label: 'Complex', color: 'text-red-700', bg: 'bg-red-100' },
};

export default function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  const [expandedSummary, setExpandedSummary] = useState(false);

  const sentiment = sentimentConfig[result.sentiment];
  const complexity = complexityConfig[result.complexity];

  const handleDownload = () => {
    const content = [
      '# AI Document Analysis Report',
      '',
      '## Summary',
      result.summary,
      '',
      '## Key Insights',
      ...result.keyInsights.map(i => `- ${i}`),
      '',
      '## Topics',
      result.topics.join(', '),
      '',
      '## Key Phrases',
      result.keyPhrases.join(', '),
      '',
      '## Action Items',
      ...result.actionItems.map(a => `- ${a}`),
      '',
      '## Statistics',
      `- Word Count: ${result.wordCount}`,
      `- Reading Time: ${result.readingTime} min`,
      `- Sentiment: ${result.sentiment}`,
      `- Complexity: ${result.complexity}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analysis-report.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analysis Complete</h2>
          <p className="text-slate-500 text-sm mt-1">Here are the insights from your document</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 text-sm font-medium rounded-lg transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New Analysis
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Hash className="w-5 h-5 text-indigo-500" />}
          label="Word Count"
          value={result.wordCount.toLocaleString()}
          bg="bg-indigo-50"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-purple-500" />}
          label="Reading Time"
          value={`${result.readingTime} min`}
          bg="bg-purple-50"
        />
        <StatCard
          icon={
            <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${sentiment.bg} ${sentiment.color}`}>
              {sentiment.emoji}
            </span>
          }
          label="Sentiment"
          value={sentiment.label}
          bg={sentiment.bg}
        />
        <StatCard
          icon={
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${complexity.bg} ${complexity.color}`}>
              {complexity.label}
            </span>
          }
          label="Complexity"
          value={complexity.label}
          bg={complexity.bg}
        />
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-indigo-500" />
          <h3 className="font-semibold text-slate-900">Document Summary</h3>
        </div>
        <p className={`text-slate-700 leading-relaxed ${!expandedSummary && result.summary.length > 300 ? 'line-clamp-3' : ''}`}>
          {result.summary}
        </p>
        {result.summary.length > 300 && (
          <button
            onClick={() => setExpandedSummary(!expandedSummary)}
            className="mt-3 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {expandedSummary ? (
              <><ChevronUp className="w-4 h-4" /> Show less</>
            ) : (
              <><ChevronDown className="w-4 h-4" /> Read more</>
            )}
          </button>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Key Insights */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-slate-900">Key Insights</h3>
          </div>
          <ul className="space-y-3">
            {result.keyInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm text-slate-700 leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-slate-900">Action Items</h3>
          </div>
          <ul className="space-y-3">
            {result.actionItems.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded border-2 border-green-400 flex-shrink-0 mt-0.5"></div>
                <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Topics & Key Phrases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-slate-900">Main Topics</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.topics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium capitalize"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-slate-900">Key Phrases</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.keyPhrases.map((phrase, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-sm capitalize"
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-xl p-4 border border-white`}>
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-lg font-bold text-slate-900 mt-0.5">{value}</p>
    </div>
  );
}
