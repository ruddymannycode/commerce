"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, ShieldCheck, CheckCircle2, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import Link from "next/link";

/**
 * ResetPasswordPage Component
 * Handles the actual password update using the 6-digit Reset OTP.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle form submission to update password
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (formData.code.length !== 6) {
      toast.error("Please enter the 6-digit reset code");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: formData.code,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      toast.success(data.message);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create New Password" 
      subtitle={`Resetting password for ${email}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Reset Code Input */}
        <Input
          label="6-Digit Reset Code"
          name="code"
          placeholder="000000"
          maxLength={6}
          value={formData.code}
          onChange={handleChange}
          required
          leftIcon={<ShieldCheck size={18} />}
          helperText="Enter the code we sent to your email."
        />

        {/* New Password Input */}
        <Input
          label="New Password"
          name="newPassword"
          type="password"
          placeholder="••••••••"
          value={formData.newPassword}
          onChange={handleChange}
          required
          leftIcon={<Lock size={18} />}
        />

        {/* Confirm Password Input */}
        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          leftIcon={<ShieldCheck size={18} />}
        />

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isLoading}
          rightIcon={<CheckCircle2 size={18} />}
        >
          Update Password
        </Button>

        <Link 
          href="/auth/forgot-password" 
          className="flex items-center justify-center text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium group"
        >
          <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Request new code
        </Link>
      </form>
    </AuthLayout>
  );
}
