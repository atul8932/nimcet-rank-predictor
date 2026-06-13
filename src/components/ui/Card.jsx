import React from "react";

export const Card = ({ children, className = "", hover = false }) => {
  return (
    <div 
      className={`
        bg-white dark:bg-slate-800/90 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none
        border border-slate-100 dark:border-slate-700/50 backdrop-blur-xl
        ${hover ? "transition-all duration-300 hover:shadow-2xl hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
