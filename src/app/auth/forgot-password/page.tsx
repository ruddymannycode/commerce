"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/**
 * ForgotPasswordPage Component
 * Allows users to initiate the password recovery process by requesting an OTP.
 */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  /**
   * Handle form submission to send a reset OTP.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the forgot-password API
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset code");
      }

      toast.success(data.message);
      setIsSent(true);
      
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Forgot Password?" 
      subtitle="No worries, we'll send you instructions to reset it."
    >
      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail size={18} />}
            helperText="We will send a 6-digit reset code to this email."
          />

          <Button 
            type="submit" 
            className="w-full" 
            isLoading={isLoading}
            rightIcon={<Send size={18} />}
          >
            Send Reset Code
          </Button>

          <Link 
            href="/auth/login" 
            className="flex items-center justify-center text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium group"
          >
            <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
        </form>
      ) : (
        /* Success State: Instructions after email is sent */
        <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in duration-300">
          <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
            <Send size={28} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Check your email</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              We've sent a password reset code to <br />
              <span className="font-semibold text-slate-900 dark:text-white">{email}</span>
            </p>
          </div>

          <Button 
            className="w-full"
            onClick={() => router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`)}
          >
            Enter Reset Code
          </Button>

          <button 
            onClick={() => setIsSent(false)} 
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            Incorrect email? Try again
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
