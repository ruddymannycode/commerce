"use client";

import React from "react";

/**
 * Interface for the Input component properties.
 * Extending HTMLInputElement attributes gives us access to standard props like 
 * 'value', 'onChange', 'placeholder', 'type', etc.
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string; // Message to display if there's a validation error
  helperText?: string;
  leftIcon?: React.ReactNode;
}

/**
 * Input Component
 * A customizable input field with label, error handling, and icon support.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, className = "", id, ...props }, ref) => {
    // Unique ID if none provided, helpful for accessibility (linking labels to inputs)
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="w-full space-y-2">
        {/* Label display */}
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1"
          >
            {label}
          </label>
        )}
        
        {/* Input Wrapper for Icon position */}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-xl py-3 px-4 transition-all duration-200
              ${leftIcon ? "pl-11" : "pl-4"}
              bg-white dark:bg-slate-900 
              border border-slate-200 dark:border-slate-800
              focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none
              placeholder:text-slate-400
              disabled:opacity-50 disabled:bg-slate-50
              ${error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        
        {/* Error message or Helper text */}
        {error ? (
          <p className="text-xs text-red-500 ml-1 mt-1 font-medium animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 ml-1 mt-1 italic">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

// Setting a display name facilitates debugging in React DevTools
Input.displayName = "Input";

export default Input;
