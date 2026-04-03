import { Brain, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI Document Analyzer</h1>
              <p className="text-xs text-slate-500">Powered by intelligent text analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>AI Powered</span>
          </div>
        </div>
      </div>
    </header>
  );
}
