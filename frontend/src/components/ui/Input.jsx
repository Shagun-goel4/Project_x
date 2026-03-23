import React, { forwardRef } from 'react';
import { cn } from './Button';

export const Input = forwardRef(({ className, label, error, icon: Icon, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400",
            "focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            Icon && "pl-11",
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-sm text-red-500 animate-fade-in">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
