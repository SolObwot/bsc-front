
import React from 'react';

// Removed unused TypeScript interface and replaced with JavaScript props destructuring

const ProgressBar = ({ progress, size = 'small' }) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    large: 'w-20 h-20'
  };
  
  // Calculate the circumference and the offset
  const radius = size === 'small' ? 24 : 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          className="text-okr-progress"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-semibold text-sm"
          fill={progress === 0 ? "#9CA3AF" : "#000"}
        >
          {progress}%
        </text>
      </svg>
    </div>
  );
};

export default ProgressBar;
