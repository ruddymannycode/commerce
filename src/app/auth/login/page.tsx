"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AnimatedGlobe from "@/components/auth/AnimatedGlobe";

/**
 * LoginPage Component
 * High-fidelity 1:1 implementation matching the final Figma design.
 */
export default function LoginPage() {
  const router = useRouter();

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.unverified) {
          toast.warning(data.message);
          router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}`);
          return;
        }
        throw new Error(data.message || "Invalid credentials");
      }
      toast.success(data.message);
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Signing in with ${provider}...`);
  };

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] font-sans selection:bg-[#5E2B96]/20 overflow-hidden">
      
      {/* 
        --- LEFT SIDE BANNER (Floating Card Style) ---
      */}
      <div className="hidden lg:flex lg:w-1/2 p-4 xl:p-5 h-screen overflow-hidden">
        <div className="w-full h-full bg-[#5E2B96] rounded-xl relative flex flex-col p-12 overflow-hidden shadow-xl">
          
          {/* Top Branding Badge */}
          <div className="bg-white rounded-lg py-2.5 px-6 w-fit flex items-center shadow-lg relative z-20">
            <div className="w-5 h-5 bg-[#5E2B96] rounded-md flex items-center justify-center mr-3">
               <span className="text-white text-[9px] font-black">V</span>
            </div>
            <span className="text-[#1A1A1A] font-extrabold text-xl tracking-tight">VestRoll</span>
          </div>

          {/* Centered Illustration Section */}
          <div className="flex-1 flex items-center justify-center relative scale-100">
            <AnimatedGlobe />
          </div>

          {/* Promotional Headline */}
          <div className="space-y-4 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-800 mt-auto pb-6">
            <h2 className="text-[52px] font-bold text-white leading-[1.05] tracking-tight">
              Seamless Payments,<br />Anywhere.
            </h2>
            <p className="text-white/80 text-[16px] max-w-[380px] font-medium leading-relaxed">
              VestRoll lets you manage payroll and invoicing in crypto and fiat—quickly and securely.
            </p>
          </div>

          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-white/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 
        --- RIGHT SIDE (AUTHENTICATION FORM) ---
      */}
      <div className="flex-1 flex flex-col min-h-screen bg-white overflow-y-auto">
        
        <div className="flex-1 flex items-center justify-center px-6 py-12 md:px-12 xl:px-24">
          <div className="w-full max-w-[430px] space-y-10">
            
            {/* Header Title & Subtitle */}
            <div className="space-y-4">
              <h1 className="text-[48px] font-bold text-[#111827] tracking-tight leading-none text-left">
                Welcome back!
              </h1>
              <p className="text-[#6B7280] text-[17px] font-medium leading-normal">
                Securely access your account and manage payroll with ease
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              
              {/* Email Control */}
              <div className="space-y-2.5">
                <label className="text-[14px] font-bold text-[#374151] ml-1">Email address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Provide email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full h-[58px] px-6 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl focus:bg-white focus:border-[#5E2B96]/30 outline-none transition-all duration-300 placeholder:text-[#9CA3AF] text-[16px] font-medium text-slate-900 shadow-sm"
                />
              </div>

              {/* Password Control */}
              <div className="space-y-2.5">
                <label className="text-[14px] font-bold text-[#374151] ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full h-[58px] px-6 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl focus:bg-white focus:border-[#5E2B96]/30 outline-none transition-all duration-300 placeholder:text-[#9CA3AF] text-[16px] font-medium text-slate-900 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#5E2B96] transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                
                <div className="flex justify-end mt-1">
                  <Link href="/auth/forgot-password" title="Recover Access" className="text-[14px] font-bold text-[#5E2B96] hover:underline underline-offset-8 decoration-2">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Action Trigger */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-[60px] bg-[#5E2B96] text-white rounded-xl font-bold text-[18px] hover:bg-[#4A207A] active:scale-[0.985] transition-all duration-300 shadow-xl shadow-indigo-100 flex items-center justify-center space-x-3 disabled:opacity-80"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Continue</span>
                )}
              </button>

              {/* Visual Boundary */}
              <div className="relative flex items-center py-3">
                <div className="grow border-t border-[#F1F3F5]"></div>
                <span className="shrink mx-5 text-[12px] font-bold text-[#ADB5BD] uppercase tracking-widest">OR</span>
                <div className="grow border-t border-[#F1F3F5]"></div>
              </div>

              {/* External Auth Grid */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  className="h-[58px] bg-white border border-[#E9ECEF] rounded-xl flex items-center justify-center space-x-3 hover:bg-[#F8F9FA] transition-all duration-300 group shadow-sm"
                >
                  <span className="text-[14px] font-bold text-[#495057]">Login with</span>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 group-hover:scale-110 transition-transform"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </button>
                <button 
                  type="button"
                  onClick={() => handleSocialLogin("Apple")}
                  className="h-[58px] bg-white border border-[#E9ECEF] rounded-xl flex items-center justify-center space-x-3 hover:bg-[#F8F9FA] transition-all duration-300 group shadow-sm"
                >
                  <span className="text-[14px] font-bold text-[#495057]">Login with</span>
                   <svg viewBox="0 0 24 24" className="w-5 h-5 group-hover:scale-110 transition-transform"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.75 1.18-.02 2.31-.93 3.57-.84 1.51.1 2.65.6 3.31 1.59-3.07 1.75-2.58 5.76.51 7.01-.64 1.62-1.51 3.21-2.97 4.46zM12.03 7.25c-.02-2.3 1.96-4.33 4.22-4.25.17 2.45-1.92 4.49-4.22 4.25z" fill="#000000"/></svg>
                </button>
              </div>

              {/* Sign Up Connectivity Footer */}
              <div className="pt-6 text-center">
                <p className="text-[16px] font-bold text-[#ADB5BD] tracking-tight">
                  New to VestRoll? <Link href="/auth/signup" className="text-[#5E2B96] hover:underline underline-offset-4 font-bold ml-1">Create account</Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Universal Interaction Footer */}
        <footer className="w-full flex flex-col md:flex-row items-center justify-between px-10 md:px-16 py-10 text-[13px] font-bold text-[#ADB5BD] border-t border-[#F1F3F5] bg-white mt-auto">
          <p>© 2025, all rights reserved</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
             <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
             <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms and condition</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
