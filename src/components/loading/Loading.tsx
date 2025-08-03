import React from 'react';
import { Spinner } from '@heroicons/react/24/outline';

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  center?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ text = 'טוען...', size = 'md', center = true }) => {
  const sizeClasses = {
    sm: 'w-4 h-2',
    md: 'w-6 h-4',
    lg: 'w-10 h-8'
  };

  return (
    <div className={center ? 'flex flex-col items-center justify-center py-2' : 'inline-flex items-center gap-2'}>
      <svg
        className={`animate-spin text-teal-600 ${sizeClasses[size]}`}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default Loading;
