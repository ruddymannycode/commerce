"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

/**
 * Interface for AuthLayout properties
 */
interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

/**
 * AuthLayout Component
 * Provides a consistent, premium design for all authentication-related pages.
 * Features a split layout or centered layout depending on the screen size.
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      {/* 
        Background Decorative Elements:
        We add some subtle blurs in the background to give that modern "Glassmorphism" feel.
      */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-4">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 transform transition-transform hover:scale-110 active:scale-95"
          >
            <ShoppingBag size={28} strokeWidth={2.5} />
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Content Card */}
        <div className="glass p-8 rounded-3xl space-y-6">
          {children}
        </div>
        
        {/* Small Footer or Help link */}
        <div className="text-center text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} Modern Commerce. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
