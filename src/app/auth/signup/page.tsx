"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

/**
 * SignupPage Component
 * Handles user and admin registration.
 */
export default function SignupPage() {
  const router = useRouter();

  // State management for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as "user" | "admin", // Toggle between user and admin signup
  });
  
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Universal change handler for all input fields.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Form submission handler.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Call the backend API
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // 2. Success: Notify user and redirect
      toast.success(data.message);
      router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}`);
      
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join our exclusive commerce community"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Role Toggle: User or Admin */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setFormData(p => ({...p, role: 'user'}))}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              formData.role === 'user' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' 
                : 'text-slate-500'
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setFormData(p => ({...p, role: 'admin'}))}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              formData.role === 'admin' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' 
                : 'text-slate-500'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Full Name Input */}
        <Input
          label="Full Name"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          required
          leftIcon={<User size={18} />}
        />

        {/* Email Input */}
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          leftIcon={<Mail size={18} />}
        />

        {/* Password Input with Toggle Visibility */}
        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            leftIcon={<Lock size={18} />}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-10 text-slate-400 hover:text-indigo-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password Input */}
        <Input
          label="Confirm Password"
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
        >
          {formData.role === 'admin' ? "Register as Admin" : "Create Account"}
        </Button>

        {/* Navigation Link to Login */}
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link 
            href="/auth/login" 
            className="text-indigo-600 hover:underline font-semibold"
          >
            Login here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
