'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { KeywordAnalysis } from '@/lib/analyzeKeyword';

interface ScoreBarChartProps {
  results: KeywordAnalysis[];
}

const GRADIENT_COLORS = [
  '#06b6d4', '#22d3ee', '#34d399', '#a78bfa',
  '#818cf8', '#c084fc', '#f472b6', '#fbbf24',
  '#fb923c', '#38bdf8',
];

export default function ScoreBarChart({ results }: ScoreBarChartProps) {
  const top10 = [...results]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 10)
    .map((r) => ({
      name: r.keyword.length > 20 ? r.keyword.slice(0, 18) + '…' : r.keyword,
      score: r.overallScore,
      fullName: r.keyword,
    }));

  return (
    <div className="glass-card p-6 animate-fade-in-up flex flex-col items-center text-center" style={{ animationDelay: '200ms' }}>
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">
        Общая ИИ-оценка по фразам
        <span className="text-slate-500 font-normal ml-2">(Топ 10)</span>
      </h3>
      <div className="w-full h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={top10} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={false}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={70}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(6,182,212,0.06)' }}
              contentStyle={{
                background: '#111827',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                color: '#e2e8f0',
                fontSize: '13px',
              }}
              formatter={(value) => [`${value}`, 'Общая оценка']}
              labelFormatter={(label) => {
                const item = top10.find((d) => d.name === label);
                return item?.fullName || label;
              }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {top10.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
