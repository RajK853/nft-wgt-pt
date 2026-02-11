/**
 * Score Result Display Component
 * 
 * Displays scoring results with visual indicators and grade information.
 * Follows KISS principle with clear, readable code.
 */

import React from 'react';

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
 * Get grade background color for styling
 */
const getGradeBgColor = (grade: string): string => {
  switch (grade) {
    case 'A': return 'bg-green-900/20 border-green-500/30';
    case 'B': return 'bg-blue-900/20 border-blue-500/30';
    case 'C': return 'bg-orange-900/20 border-orange-500/30';
    case 'D': return 'bg-red-900/20 border-red-500/30';
    case 'F': return 'bg-gray-900/20 border-gray-500/30';
    default: return 'bg-gray-900/20 border-gray-500/30';
  }
};

/**
 * Score result display component
 */
export function ScoreResultDisplay({ score }: ScoreResultDisplayProps) {
  const gradeColor = getGradeColor(score.grade);
  const gradeBgColor = getGradeBgColor(score.grade);

  return (
    <div className="score-result bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Score Breakdown</h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${gradeBgColor}`}>
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: gradeColor }}
          />
          <span className="text-white font-semibold text-lg">{score.grade}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Total Score */}
        <div className="total-score text-center py-4">
          <div className="text-4xl font-bold text-white mb-2">
            {score.totalScore}
          </div>
          <div className="text-gray-400 text-sm">Total Score</div>
        </div>

        {/* Score Components */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="score-component bg-gray-900/50 p-4 rounded-lg border border-gray-600">
            <div className="text-blue-400 text-sm font-medium mb-1">Base Score</div>
            <div className="text-2xl font-bold text-white">{score.baseScore}</div>
            <div className="text-xs text-gray-400 mt-1">Accuracy × Difficulty × 10</div>
          </div>

          <div className="score-component bg-gray-900/50 p-4 rounded-lg border border-gray-600">
            <div className="text-green-400 text-sm font-medium mb-1">Accuracy Bonus</div>
            <div className="text-2xl font-bold text-white">{score.accuracyBonus}</div>
            <div className="text-xs text-gray-400 mt-1">Based on accuracy tier</div>
          </div>

          <div className="score-component bg-gray-900/50 p-4 rounded-lg border border-gray-600">
            <div className="text-yellow-400 text-sm font-medium mb-1">Speed Bonus</div>
            <div className="text-2xl font-bold text-white">{score.speedBonus}</div>
            <div className="text-xs text-gray-400 mt-1">Based on speed threshold</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Score Progress</span>
            <span>{score.totalScore}/1000</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
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
    </div>
  );
}