"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * --- THEME PROVIDER ---
 * This component wraps our entire app and manages 'dark' vs 'light' mode.
 * It uses the 'next-themes' library which automatically stores the user's
 * preference in LocalStorage and applies the correct CSS classes to the <html> tag.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider 
      attribute="class" // Applies the theme as a class on the HTML element
      defaultTheme="system" // Default to the user's OS preference
      enableSystem
      disableTransitionOnChange // Prevents a flash of light mode during rapid switching
    >
      {children}
    </NextThemesProvider>
  );
}
