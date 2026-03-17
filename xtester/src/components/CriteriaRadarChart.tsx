'use client';

import React from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { KeywordAnalysis } from '@/lib/analyzeKeyword';

interface CriteriaRadarChartProps {
  topKeyword: KeywordAnalysis;
}

export default function CriteriaRadarChart({ topKeyword }: CriteriaRadarChartProps) {
  const data = [
    { criteria: 'Намерение', value: topKeyword.intentMatch },
    { criteria: 'Активность', value: topKeyword.velocity },
    { criteria: 'Диалогичность', value: topKeyword.conversationalPotential },
    { criteria: 'Аудитория', value: topKeyword.audienceQuality },
    { criteria: 'Чистота от спама', value: 100 - topKeyword.spamRatio },
  ];

  return (
    <div className="glass-card p-6 animate-fade-in-up flex flex-col items-center text-center" style={{ animationDelay: '300ms' }}>
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
        Разбивка по критериям
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        Лучшая фраза: <span className="text-cyan-400 font-medium">{topKeyword.keyword}</span>
      </p>
      <div className="w-full h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis
              dataKey="criteria"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#475569', fontSize: 10 }}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#111827',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                color: '#e2e8f0',
                fontSize: '13px',
              }}
              formatter={(value) => [`${value}`, 'Оценка']}
            />
            <Radar
              name="Оценка"
              dataKey="value"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
