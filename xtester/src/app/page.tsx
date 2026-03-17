'use client';

import React, { useState, useCallback } from 'react';
import { analyzeKeyword, KeywordAnalysis, SearchFilters } from '@/lib/analyzeKeyword';
import KeywordInput from '@/components/KeywordInput';
import SummaryCards from '@/components/SummaryCards';
import ScoreBarChart from '@/components/ScoreBarChart';
import CriteriaRadarChart from '@/components/CriteriaRadarChart';
import ResultsTable from '@/components/ResultsTable';

type AppState = 'idle' | 'processing' | 'results';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [results, setResults] = useState<KeywordAnalysis[]>([]);
  const [progress, setProgress] = useState(0);
  const [totalKeywords, setTotalKeywords] = useState(0);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleAnalyze = useCallback(async (keywords: string[], filters: SearchFilters) => {
    setAppState('processing');
    setTotalKeywords(keywords.length);
    setProgress(0);
    setResults([]);

    const analysisResults: KeywordAnalysis[] = [];

    for (let i = 0; i < keywords.length; i++) {
      setCurrentKeyword(keywords[i]);
      const result = await analyzeKeyword(keywords[i], filters);
      analysisResults.push(result);
      setProgress(i + 1);
    }

    setResults(analysisResults);
    setAppState('results');
  }, []);

  const handleReset = () => {
    setAppState('idle');
    setResults([]);
    setProgress(0);
    setTotalKeywords(0);
    setCurrentKeyword('');
  };

  const handleExportForAI = () => {
    let promptText = "Пожалуйста, выступи в роли опытного эксперта по маркетингу в Twitter. Проанализируй эти результаты сбора фраз и дай рекомендации по контенту для стартапа.\n\n";
    promptText += "--- ДАННЫЕ О ФРАЗАХ ---\n";
    
    results.forEach(r => {
      promptText += `\nКлючевая фраза: "${r.keyword}"\n`;
      promptText += `Общая ИИ-оценка: ${r.overallScore}/100 (Чем выше, тем лучше)\n`;
      promptText += `Постов найдено: ${r.totalPostsFound}\n`;
      promptText += `Уровень спама в постах: ${r.spamRatio}%\n`;
      promptText += `Активность аудитории (лайки/ответы): ${r.velocity}/100\n`;
      
      if (r.tweets && r.tweets.length > 0) {
        promptText += `Примеры самых популярных постов:\n`;
        // Grab top 3 tweets for the prompt to keep it concise
        r.tweets.slice(0, 3).forEach((t, i) => {
          const text = t.text || t.full_text || '';
          const likes = t.likes ?? t.favorite_count ?? t.likeCount ?? 0;
          const cleanText = text.replace(/(\r\n|\n|\r)/gm, " ").trim();
          promptText += ` - Твит ${i+1} [${likes} лайков]: "${cleanText}"\n`;
        });
      }
    });

    promptText += "\n--- ТВОЯ ЗАДАЧА ---\n";
    promptText += "1. Выбери 2-3 самые перспективные фразы для генерации лидов (золотая жила) на основе высокой оценки и низкой заспамленности.\n";
    promptText += "2. Объясни, почему именно они сработают лучше всего.\n";
    promptText += "3. Дай 3 конкретных совета/черновика для создания постов или реплаев под эти фразы.";

    navigator.clipboard.writeText(promptText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const topKeyword =
    results.length > 0
      ? results.reduce((best, cur) => (cur.overallScore > best.overallScore ? cur : best), results[0])
      : null;

  return (
    <main className="min-h-screen px-4 py-10 sm:px-8 lg:px-16 flex flex-col items-center">
      {/* Top nav bar */}
      <nav className="flex items-center justify-between w-full max-w-5xl mb-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
            X
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">
            XTester <span className="text-slate-500 text-sm font-normal">/ ИИ-Анализатор Ключевых Слов</span>
          </span>
        </div>
        {appState === 'results' && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportForAI}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border ${
                isCopied 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border-indigo-500/30'
              }`}
            >
              {isCopied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Скопировано!
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  Экспорт для ИИ
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer border border-slate-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
              Новый анализ
            </button>
          </div>
        )}
      </nav>

      <div className="w-full max-w-5xl flex flex-col items-center">
        {/* Input Section */}
        {(appState === 'idle' || appState === 'processing') && (
          <KeywordInput
            onAnalyze={handleAnalyze}
            isProcessing={appState === 'processing'}
            progress={progress}
            totalKeywords={totalKeywords}
            currentKeyword={currentKeyword}
          />
        )}

        {/* Dashboard Results */}
        {appState === 'results' && results.length > 0 && (
          <div className="animate-fade-in-up w-full flex flex-col items-center">
            {/* Summary Cards */}
            <div className="w-full">
              <SummaryCards results={results} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8 w-full">
              <ScoreBarChart results={results} />
              {topKeyword && <CriteriaRadarChart topKeyword={topKeyword} />}
            </div>

            {/* Results Table */}
            <div className="w-full">
              <ResultsTable results={results} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
