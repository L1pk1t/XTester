'use client';

import React from 'react';
import { KeywordAnalysis } from '@/lib/analyzeKeyword';

interface SummaryCardsProps {
  results: KeywordAnalysis[];
}

export default function SummaryCards({ results }: SummaryCardsProps) {
  const totalKeywords = results.length;

  const topKeyword = results.reduce(
    (best, cur) => (cur.overallScore > best.overallScore ? cur : best),
    results[0]
  );

  const avgSpam =
    results.reduce((sum, r) => sum + r.spamRatio, 0) / results.length;

  const cards = [
    {
      label: 'Проанализировано слов',
      value: totalKeywords.toString(),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 013.002 3.002L7.368 18.635a2 2 0 01-.855.506l-2.872.838.838-2.872a2 2 0 01.506-.855z"/></svg>
      ),
      accent: 'from-cyan-500/20 to-cyan-500/5',
      borderAccent: 'border-cyan-500/20',
    },
    {
      label: 'Лучшая фраза',
      value: topKeyword.keyword,
      sub: `Оценка: ${topKeyword.overallScore}`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg>
      ),
      accent: 'from-emerald-500/20 to-emerald-500/5',
      borderAccent: 'border-emerald-500/20',
    },
    {
      label: 'Средний уровень спама',
      value: `${avgSpam.toFixed(1)}%`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      ),
      accent: 'from-rose-500/20 to-rose-500/5',
      borderAccent: 'border-rose-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8 w-full">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`glass-card p-5 bg-gradient-to-br ${card.accent} border ${card.borderAccent} animate-fade-in-up flex flex-col items-center text-center`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex flex-col items-center justify-center mb-3">
            {/* Added mb-2 to separate icon and label nicely */}
            <div className="mb-2">{card.icon}</div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {card.label}
            </span>
          </div>
          <p className="text-2xl font-bold text-white truncate max-w-full">{card.value}</p>
          {card.sub && (
            <p className="text-sm text-slate-400 mt-1">{card.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
