'use client';

import React, { useState } from 'react';
import { SearchFilters } from '@/lib/analyzeKeyword';

interface KeywordInputProps {
  onAnalyze: (keywords: string[], filters: SearchFilters) => void;
  isProcessing: boolean;
  progress: number;
  totalKeywords: number;
  currentKeyword: string;
}

export default function KeywordInput({
  onAnalyze,
  isProcessing,
  progress,
  totalKeywords,
  currentKeyword,
}: KeywordInputProps) {
  const [text, setText] = React.useState('');
  const [showFilters, setShowFilters] = useState(true);

  const [filters, setFilters] = useState<SearchFilters>({
    searchType: 'top',
    limit: 20,
    minFaves: 0,
    minRetweets: 0,
    lang: 'en',
    since: '',
    until: '',
  });

  const handleSubmit = () => {
    const keywords = text
      .split('\n')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    if (keywords.length === 0) return;
    onAnalyze(keywords, filters);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === 'limit' || name === 'minFaves' || name === 'minRetweets' ? Number(value) : value,
    }));
  };

  const progressPercent = totalKeywords > 0 ? (progress / totalKeywords) * 100 : 0;

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in-up flex flex-col items-center text-center">
      {/* Header */}
      <div className="mb-8 w-full flex flex-col items-center">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          Массовый Анализатор Слов
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight text-center">
          ИИ-Анализ <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Ключевых Фраз</span>
        </h1>
        <p className="text-slate-400 text-base max-w-lg mx-auto text-center">
          Вставьте ключевые фразы для поиска в X (Twitter) ниже — по одной в строке — и наш ИИ оценит их потенциал.
        </p>
      </div>

      <div className="w-full flex flex-col gap-4">
         {/* Advanced Filters */}
        <div className="glass-card p-5 w-full text-left">
           <button 
             onClick={() => setShowFilters(!showFilters)}
             className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors w-full"
           >
             <svg 
               className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
               fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
             </svg>
             Дополнительные фильтры
           </button>

           {showFilters && (
             <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Min Likes */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Мин. лайков</label>
                  <input
                    type="number"
                    name="minFaves"
                    value={filters.minFaves}
                    onChange={handleChange}
                    min="0"
                    disabled={isProcessing}
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
                {/* Min Retweets */}
                <div>
                   <label className="block text-xs text-slate-400 mb-1.5 font-medium">Мин. ретвитов</label>
                   <input
                     type="number"
                     name="minRetweets"
                     value={filters.minRetweets}
                     onChange={handleChange}
                     min="0"
                     disabled={isProcessing}
                     className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
                   />
                </div>
                {/* Language */}
                <div>
                   <label className="block text-xs text-slate-400 mb-1.5 font-medium">Язык</label>
                   <input
                     type="text"
                     name="lang"
                     value={filters.lang}
                     onChange={handleChange}
                     placeholder="en, ru..."
                     disabled={isProcessing}
                     className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
                   />
                </div>

                {/* Since */}
                <div>
                   <label className="block text-xs text-slate-400 mb-1.5 font-medium">С даты</label>
                   <input
                     type="date"
                     name="since"
                     value={filters.since}
                     onChange={handleChange}
                     disabled={isProcessing}
                     className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors [color-scheme:dark]"
                   />
                </div>
                 {/* Until */}
                 <div>
                   <label className="block text-xs text-slate-400 mb-1.5 font-medium">По дату</label>
                   <input
                     type="date"
                     name="until"
                     value={filters.until}
                     onChange={handleChange}
                     disabled={isProcessing}
                     className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors [color-scheme:dark]"
                   />
                </div>
                 {/* Type */}
                 <div>
                   <label className="block text-xs text-slate-400 mb-1.5 font-medium">Тип поиска</label>
                   <select
                     name="searchType"
                     value={filters.searchType}
                     onChange={handleChange}
                     disabled={isProcessing}
                     className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
                   >
                     <option value="top">Топ (Top)</option>
                     <option value="latest">Последние (Latest)</option>
                     <option value="people">Люди (People)</option>
                     <option value="photos">Фото (Photos)</option>
                     <option value="videos">Видео (Videos)</option>
                   </select>
                </div>

                {/* Limit (Full Width in bottom row) */}
                <div className="sm:col-span-3 pt-2">
                   <div className="flex justify-between items-center mb-1.5">
                     <label className="text-xs text-slate-400 font-medium">Лимит: <span className="text-cyan-400 font-bold">{filters.limit}</span></label>
                     <span className="text-xs text-slate-600">Макс: 100</span>
                   </div>
                   <input
                     type="range"
                     name="limit"
                     value={filters.limit}
                     onChange={handleChange}
                     min="1"
                     max="100"
                     disabled={isProcessing}
                     className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                   />
                </div>
             </div>
           )}
        </div>

        {/* Textarea Card */}
        <div className="glass-card p-6 w-full text-left">
          <label htmlFor="keywords-input" className="block text-sm font-medium text-slate-300 mb-2">
            Ключевые слова <span className="text-slate-500">(по одному в строке)</span>
          </label>
          <textarea
            id="keywords-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isProcessing}
            rows={8}
            placeholder={"Проблемы стартапов\nУдаленное управление командой\nВзлом роста B2B SaaS\nСтратегии холодных email\nВыгорание основателя\n..."}
            className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all resize-y disabled:opacity-50 font-mono"
          />

          {/* Keyword count */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-slate-500">
              {text.split('\n').filter((l) => l.trim()).length} слов обнаружено
            </span>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="mt-5 animate-fade-in-up">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>
                  Обработка: <span className="text-cyan-400 font-medium">{currentKeyword}</span>
                </span>
                <span>
                  {progress}/{totalKeywords}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full progress-shimmer transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isProcessing || text.trim().length === 0}
            className="btn-glow mt-5 w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold text-sm tracking-wide uppercase hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Анализ фраз...
              </span>
            ) : (
              '🚀 Запустить ИИ-Анализ'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
