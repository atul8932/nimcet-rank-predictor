import React from "react";

export const Input = React.forwardRef(({ label, error, icon, className = "", ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-4 text-slate-400 dark:text-slate-500">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`
            w-full py-3 rounded-xl border bg-white/50 dark:bg-slate-800/50 
            text-slate-900 dark:text-slate-100 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            ${icon ? "pl-11 pr-4" : "px-4"}
            ${error 
              ? "border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/20" 
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500"
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";
