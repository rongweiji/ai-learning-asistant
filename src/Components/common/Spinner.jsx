import React from 'react'

// Lightweight spinner that matches the emerald accent used on auth forms
const Spinner = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };
  const dimension = sizeMap[size] || sizeMap.md;

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <span
        className={`animate-spin rounded-full border-2 border-emerald-500 border-t-transparent ${dimension}`}
      />
    </span>
  );
};

export default Spinner