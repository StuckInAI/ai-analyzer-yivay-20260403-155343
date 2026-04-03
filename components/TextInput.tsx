'use client';

import { useState } from 'react';
import { FileText, Wand2 } from 'lucide-react';

const SAMPLE_TEXT = `Artificial Intelligence (AI) is transforming industries across the globe, bringing unprecedented opportunities and challenges. Organizations that successfully implement AI solutions are seeing significant improvements in efficiency, productivity, and innovation.

Key benefits of AI adoption include automated decision-making, enhanced customer experiences, and data-driven insights that were previously impossible to obtain at scale. Companies should consider implementing AI strategies to remain competitive in today's rapidly evolving market.

However, there are important challenges to address. Data privacy concerns, algorithmic bias, and the need for skilled talent represent significant obstacles. Organizations must develop comprehensive AI governance frameworks to ensure ethical and responsible use of these powerful technologies.

Recommendations for successful AI implementation:
1. Start with clear business objectives aligned to AI capabilities
2. Invest in data quality and infrastructure
3. Build cross-functional teams combining domain expertise with technical skills
4. Establish robust testing and monitoring processes
5. Ensure transparency and explainability in AI systems

The future of AI looks promising, with advances in natural language processing, computer vision, and reinforcement learning opening new possibilities. Organizations that embrace these technologies thoughtfully will be well-positioned for long-term success.`;

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: (text: string) => void;
}

export default function TextInput({ value, onChange, onAnalyze }: TextInputProps) {
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setCharCount(newValue.length);
  };

  const handleSample = () => {
    onChange(SAMPLE_TEXT);
    setCharCount(SAMPLE_TEXT.length);
  };

  const isOverLimit = charCount > 50000;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          <span className="font-medium text-slate-900">Document Text</span>
        </div>
        <button
          onClick={handleSample}
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          Load Sample
        </button>
      </div>

      <div className="p-5">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="Paste your document text here... (minimum 10 characters, maximum 50,000)"
          className="w-full h-64 resize-none text-slate-700 placeholder-slate-400 text-sm leading-relaxed focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{wordCount.toLocaleString()} words</span>
          <span className={isOverLimit ? 'text-red-500 font-medium' : ''}>
            {charCount.toLocaleString()} / 50,000 characters
          </span>
        </div>
        <button
          onClick={() => onAnalyze(value)}
          disabled={!value.trim() || isOverLimit}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          Analyze Document
        </button>
      </div>
    </div>
  );
}
