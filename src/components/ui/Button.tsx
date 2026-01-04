"use client";

import React from "react";
import { Loader2 } from "lucide-react";

/**
 * --- WHAT IS AN INTERFACE? ---
 * An 'interface' is a TypeScript blueprint. It defines exactly what properties 
 * this component is allowed to receive. 
 * 'extends React.ButtonHTMLAttributes' means our button can also accept all 
 * standard HTML button props like 'onClick', 'title', 'id', etc.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // We use the '?' to make these props optional.
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean; // Shows a loading spinner if the user clicked it
  leftIcon?: React.ReactNode; // Can be a Lucide Icon or a regular <span>
  rightIcon?: React.ReactNode;
}

/**
 * --- THE COMPONENT DEFINITION ---
 * We use 'React.FC<ButtonProps>' to tell React this is a 'Functional Component'
 * that follows the 'ButtonProps' blueprint.
 */
const Button: React.FC<ButtonProps> = ({
  children, // The text or elements inside the <Button> labels </Button>
  variant = "primary", // Default variant if none provided
  size = "md", // Default size
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "", // Any extra tailwind styles passed from the outside
  disabled,
  ...props // (...props) spreads all other standard HTML attributes like 'type'
}) => {
  
  /**
   * --- DYNAMIC STYLING ---
   * We store our CSS classes in objects. This is much cleaner than having
   * massive 10-line 'className' strings.
   */
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 focus:ring-indigo-500",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
    outline:
      "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20",
    ghost:
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };

  return (
    <button
      /**
       * TEMPLATE LITERALS: We use `${variable}` to combine the different 
       * sets of styles into one final string for the browser.
       */
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled} // Block the button if it's currently loading
      {...props}
    >
      {/* 
        CONDITIONAL RENDERING: 
        If loading, show the spinner. Otherwise, show the left icon.
      */}
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        leftIcon && <span className="mr-2">{leftIcon}</span>
      )}

      {/* The main text of the button */}
      {children}

      {/* Show right icon only if we are NOT loading */}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
