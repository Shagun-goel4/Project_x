import React from 'react';
import { cn } from './Button';

export const LoadingSpinner = ({ className, size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={cn("inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] text-primary-600 motion-reduce:animate-[spin_1.5s_linear_infinite]", sizes[size], className)} role="status">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
    </div>
  );
};
