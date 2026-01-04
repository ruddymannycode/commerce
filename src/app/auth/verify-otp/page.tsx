"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { KeyRound, CheckCircle2, RotateCcw } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

/**
 * VerifyOtpPage Component
 * Handles the verification of a 6-digit One Time Password (OTP).
 */
export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  // OTP state: An array of 6 strings, one for each digit
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown for resend
  
  // Refs to focus individual input boxes automatically
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /**
   * Countdown timer for the "Resend Code" feature.
   */
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  /**
   * Handles individual digit input and auto-focuses next input.
   */
  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handles backspace to move focus to previous input.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /**
   * Handle form submission for OTP verification.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    
    if (code.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    if (!email) {
      toast.error("Email missing. Please try signing up again.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid code");
      }

      toast.success(data.message);
      
      // Redirect to login page
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 1500);

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Verify Account" 
      subtitle={`We've sent a 6-digit verification code to ${email}`}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* OTP Input Container */}
        <div className="flex justify-between gap-2">
          {otp.map((data, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              maxLength={1}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
              className="w-full h-14 text-center text-xl font-bold bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          ))}
        </div>

        <div className="space-y-4">
          <Button 
            type="submit" 
            className="w-full h-12" 
            isLoading={isLoading}
            rightIcon={<CheckCircle2 size={18} />}
          >
            Verify Code
          </Button>

          {/* Resend Logic */}
          <div className="text-center">
            {timeLeft > 0 ? (
              <p className="text-sm text-slate-500">
                Resend code in <span className="font-bold text-indigo-600">{timeLeft}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setTimeLeft(60)}
                className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <RotateCcw size={14} className="mr-1" />
                Resend verification code
              </button>
            )}
          </div>
        </div>

        {/* Security badge at bottom */}
        <div className="flex items-center justify-center space-x-2 text-slate-400">
          <KeyRound size={14} />
          <span className="text-[10px] uppercase tracking-widest font-bold">Secure Verification</span>
        </div>
      </form>
    </AuthLayout>
  );
}
