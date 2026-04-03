export interface AnalysisResult {
  summary: string;
  keyInsights: string[];
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  wordCount: number;
  readingTime: number;
  complexity: 'simple' | 'moderate' | 'complex';
  keyPhrases: string[];
  actionItems: string[];
}
