/**
 * Score Result Display Component
 * 
 * Displays scoring results with visual indicators and grade information.
 * Uses shadcn Card for theme support.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/useTheme';

interface ScoreResultDisplayProps {
  score: {
    baseScore: number;
    accuracyBonus: number;
    speedBonus: number;
    totalScore: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
  };
}

/**
 * Get grade color for styling
 */
const getGradeColor = (grade: string): string => {
  switch (grade) {
    case 'A': return '#22c55e'; // Green
    case 'B': return '#3b82f6'; // Blue
    case 'C': return '#f59e0b'; // Orange
    case 'D': return '#ef4444'; // Red
    case 'F': return '#6b7280'; // Gray
    default: return '#6b7280';
  }
};

/**
 * Score result display component using shadcn Card
 */
export function ScoreResultDisplay({ score }: ScoreResultDisplayProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const gradeColor = getGradeColor(score.grade);

  return (
    <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={isDark ? "text-white text-lg" : "text-gray-900 text-lg"}>
          Score Breakdown
        </CardTitle>
        <div 
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ 
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            border: `1px solid ${gradeColor}30`
          }}
        >
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: gradeColor }}
          />
          <span 
            className="font-semibold text-lg"
            style={{ color: gradeColor }}
          >
            {score.grade}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Score */}
          <div className="text-center py-4">
            <div 
              className="text-4xl font-bold mb-2"
              style={{ color: isDark ? '#fff' : '#111' }}
            >
              {score.totalScore}
            </div>
            <div className={isDark ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>
              Total Score
            </div>
          </div>

          {/* Score Components */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}
            >
              <div className="text-blue-500 text-sm font-medium mb-1">Base Score</div>
              <div 
                className="text-2xl font-bold"
                style={{ color: isDark ? '#fff' : '#111' }}
              >
                {score.baseScore}
              </div>
              <div className={isDark ? "text-gray-500 text-xs mt-1" : "text-gray-400 text-xs mt-1"}>
                Accuracy × Difficulty × 10
              </div>
            </div>

            <div 
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}
            >
              <div className="text-green-500 text-sm font-medium mb-1">Accuracy Bonus</div>
              <div 
                className="text-2xl font-bold"
                style={{ color: isDark ? '#fff' : '#111' }}
              >
                {score.accuracyBonus}
              </div>
              <div className={isDark ? "text-gray-500 text-xs mt-1" : "text-gray-400 text-xs mt-1"}>
                Based on accuracy tier
              </div>
            </div>

            <div 
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}
            >
              <div className="text-yellow-500 text-sm font-medium mb-1">Speed Bonus</div>
              <div 
                className="text-2xl font-bold"
                style={{ color: isDark ? '#fff' : '#111' }}
              >
                {score.speedBonus}
              </div>
              <div className={isDark ? "text-gray-500 text-xs mt-1" : "text-gray-400 text-xs mt-1"}>
                Based on speed threshold
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div 
              className="flex justify-between text-sm mb-2"
              style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
            >
              <span>Score Progress</span>
              <span>{score.totalScore}/1000</span>
            </div>
            <div 
              className="w-full rounded-full h-3"
              style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb' }}
            >
              <div 
                className="h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min((score.totalScore / 1000) * 100, 100)}%`,
                  backgroundColor: gradeColor
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
