'use client';

import React, { useState, useMemo } from 'react';
import { KeywordAnalysis } from '@/lib/analyzeKeyword';

interface ResultsTableProps {
  results: KeywordAnalysis[];
}

type SortKey = keyof Pick<
  KeywordAnalysis,
  'keyword' | 'totalPostsFound' | 'spamRatio' | 'intentMatch' | 'conversationalPotential' | 'overallScore'
>;

function StatusBadge({ score }: { score: number }) {
  if (score > 80) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
        Золотая жила
      </span>
    );
  }
  if (score >= 50) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
        Хорошо
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
      Мусор
    </span>
  );
}

const COLUMNS: { key: SortKey; label: string; align?: 'right' | 'center' }[] = [
  { key: 'keyword', label: 'Фраза' },
  { key: 'totalPostsFound', label: 'Постов', align: 'center' },
  { key: 'spamRatio', label: 'Спам %', align: 'center' },
  { key: 'intentMatch', label: 'Намерение', align: 'center' },
  { key: 'conversationalPotential', label: 'Разговорность', align: 'center' },
  { key: 'overallScore', label: 'Общая оценка', align: 'center' },
];

export default function ResultsTable({ results }: ResultsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('overallScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const sorted = useMemo(() => {
    const copy = [...results];
    copy.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    return copy;
  }, [results, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const toggleRow = (keyword: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(keyword)) {
      newExpanded.delete(keyword);
    } else {
      newExpanded.add(keyword);
    }
    setExpandedRows(newExpanded);
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="text-slate-600 ml-1">↕</span>;
    return <span className="text-cyan-400 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="glass-card overflow-hidden animate-fade-in-up w-full text-center" style={{ animationDelay: '400ms' }}>
      <div className="px-6 py-5 border-b border-slate-800 flex justify-center items-center">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider text-center">
          Подробные результаты
          <span className="text-slate-500 font-normal ml-2">({results.length} слов)</span>
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/40">
              <th className="px-4 py-4 w-10"></th> {/* Expand icon column */}
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-4 text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition-colors select-none whitespace-nowrap ${
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                  } text-slate-400`}
                >
                  <div className={`flex items-center ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                    {col.label}
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-slate-400 text-center">
                Статус
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => {
              const uniqueRowKey = `${r.keyword}-${i}`;
              const isExpanded = expandedRows.has(uniqueRowKey);
              return (
                <React.Fragment key={uniqueRowKey}>
                  <tr
                    onClick={() => toggleRow(uniqueRowKey)}
                    className={`border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-800/30' : ''}`}
                    style={{ animationDelay: `${(i + 1) * 30}ms` }}
                  >
                    <td className="px-4 py-4 text-center text-slate-500">
                      <svg
                        className={`w-4 h-4 mx-auto transition-transform ${isExpanded ? 'rotate-90 text-cyan-400' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </td>
                    <td className="px-4 py-4 font-medium text-white max-w-[250px] truncate text-left">
                      {r.keyword}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-300 tabular-nums">
                      {r.totalPostsFound.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-center tabular-nums">
                      <span className={r.spamRatio > 50 ? 'text-rose-400' : r.spamRatio > 30 ? 'text-amber-400' : 'text-emerald-400'}>
                        {r.spamRatio}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-300 tabular-nums">
                      {r.intentMatch}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-300 tabular-nums">
                      {r.conversationalPotential}
                    </td>
                    <td className="px-4 py-4 text-center tabular-nums">
                      <span className="font-semibold text-white">{r.overallScore}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge score={r.overallScore} />
                    </td>
                  </tr>
                  
                  {/* Expanded Row Content */}
                  {isExpanded && (
                    <tr className="bg-slate-900/80 border-b border-slate-800">
                      <td colSpan={8} className="p-6">
                        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar text-left">
                          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Последние посты (Топ 10)
                          </h4>
                          {(!r.tweets || r.tweets.length === 0) ? (
                            <div className="text-slate-500 text-sm py-4 text-center bg-slate-800/30 rounded-lg border border-slate-700/30">
                              Посты не найдены или API недоступно.
                            </div>
                          ) : (
                            <div className="grid gap-3">
                              {r.tweets.map((tweet: any, tIndex: number) => {
                                // Provide fallback fields to handle different possible API response structures
                                const text = tweet.text || tweet.full_text || 'Без текста';
                                const likes = tweet.likes ?? tweet.favorite_count ?? tweet.likeCount ?? 0;
                                const retweets = tweet.retweets ?? tweet.retweet_count ?? tweet.retweetCount ?? 0;
                                const views = tweet.views ?? tweet.viewCount ?? null;
                                const authorName = tweet.author?.name || tweet.user?.name || 'Аноним';
                                const authorHandle = tweet.author?.userName || tweet.user?.screen_name || '';

                                return (
                                  <div key={tweet.id || tIndex} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 transition-colors hover:bg-slate-800/60">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                          {authorName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                          <div className="text-sm font-semibold text-slate-200">{authorName}</div>
                                          {authorHandle && (
                                            <div className="text-xs text-slate-500">@{authorHandle}</div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-sm text-slate-300 mb-3 whitespace-pre-wrap leading-relaxed">
                                      {text}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                      <span className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                                        {likes}
                                      </span>
                                      <span className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
                                        {retweets}
                                      </span>
                                      {views != null && (
                                        <span className="flex items-center gap-1.5 hover:text-violet-400 transition-colors">
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                          {views}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.8);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 1);
        }
      `}} />
    </div>
  );
}
