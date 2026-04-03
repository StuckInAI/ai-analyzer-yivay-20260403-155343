import { NextRequest, NextResponse } from 'next/server';

interface AnalysisResult {
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

function analyzeText(text: string): AnalysisResult {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = wordCount / Math.max(1, sentences.length);

  let complexity: 'simple' | 'moderate' | 'complex';
  if (avgWordsPerSentence < 15 && wordCount < 300) {
    complexity = 'simple';
  } else if (avgWordsPerSentence < 25 && wordCount < 1000) {
    complexity = 'moderate';
  } else {
    complexity = 'complex';
  }

  const positiveWords = ['good', 'great', 'excellent', 'positive', 'success', 'achieve', 'improve', 'benefit', 'advantage', 'opportunity', 'effective', 'efficient', 'innovative', 'growth', 'progress'];
  const negativeWords = ['bad', 'poor', 'failure', 'problem', 'issue', 'risk', 'concern', 'challenge', 'difficult', 'negative', 'decline', 'loss', 'threat', 'weakness', 'obstacle'];

  const lowerText = text.toLowerCase();
  const posCount = positiveWords.filter(w => lowerText.includes(w)).length;
  const negCount = negativeWords.filter(w => lowerText.includes(w)).length;

  let sentiment: 'positive' | 'neutral' | 'negative';
  if (posCount > negCount + 2) sentiment = 'positive';
  else if (negCount > posCount + 2) sentiment = 'negative';
  else sentiment = 'neutral';

  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'this', 'that', 'these', 'those', 'it', 'its', 'we', 'our', 'they', 'their', 'you', 'your', 'i', 'my', 'he', 'she', 'his', 'her', 'as', 'if', 'not', 'no', 'so', 'up', 'out', 'about', 'into', 'than', 'then', 'also']);

  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    if (clean.length > 3 && !stopWords.has(clean)) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  });

  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  const topics = topWords.slice(0, 5);
  const keyPhrases = topWords.slice(0, 8);

  const firstSentences = sentences.slice(0, 3).map(s => s.trim()).filter(s => s.length > 20);
  const summaryBase = firstSentences.join('. ');
  const summary = summaryBase
    ? `${summaryBase}. This document contains ${wordCount} words and covers topics including ${topics.slice(0, 3).join(', ')}.`
    : `This document contains ${wordCount} words. It covers topics including ${topics.slice(0, 3).join(', ')}. The overall tone appears to be ${sentiment}.`;

  const keyInsights: string[] = [
    `Document contains ${wordCount} words with an estimated reading time of ${readingTime} minute${readingTime > 1 ? 's' : ''}.`,
    `Complexity level is ${complexity} based on sentence structure and length.`,
    `Overall sentiment is ${sentiment} with ${posCount} positive and ${negCount} negative indicators.`,
    `Top themes identified: ${topics.slice(0, 3).join(', ')}.`,
    `Document contains ${sentences.length} sentences with an average of ${Math.round(avgWordsPerSentence)} words per sentence.`,
  ];

  const actionItems: string[] = [];
  const actionPatterns = /\b(should|must|need to|required|recommend|suggest|action|implement|consider|review|update|create|develop|ensure|provide)\b/gi;
  const actionMatches = text.match(actionPatterns);
  if (actionMatches && actionMatches.length > 0) {
    const uniqueActions = [...new Set(actionMatches.map(a => a.toLowerCase()))];
    uniqueActions.slice(0, 3).forEach(action => {
      const regex = new RegExp(`[^.]*\\b${action}\\b[^.]*\.`, 'i');
      const match = text.match(regex);
      if (match) {
        const item = match[0].trim();
        if (item.length < 200) {
          actionItems.push(item);
        }
      }
    });
  }

  if (actionItems.length === 0) {
    actionItems.push('Review the document for any follow-up requirements.');
  }

  return {
    summary,
    keyInsights,
    topics,
    sentiment,
    wordCount,
    readingTime,
    complexity,
    keyPhrases,
    actionItems,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { text?: unknown };

    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      );
    }

    const text = body.text.trim();

    if (text.length < 10) {
      return NextResponse.json(
        { error: 'Text is too short to analyze. Please provide at least 10 characters.' },
        { status: 400 }
      );
    }

    if (text.length > 50000) {
      return NextResponse.json(
        { error: 'Text is too long. Please limit to 50,000 characters.' },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    const result = analyzeText(text);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'Failed to analyze document. Please try again.' },
      { status: 500 }
    );
  }
}
