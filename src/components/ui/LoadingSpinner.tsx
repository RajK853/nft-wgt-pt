/**
 * Loading Spinner Component
 * Simple loading indicator with KISS principle
 */

import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export function LoadingSpinner({ text, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );
}
