import Link from "next/link";
import { ArrowRight, ShoppingCart, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * Landing Page Component
 * Serve as the entry point to the application, showcasing the auth modules.
 */
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      {/* Decorative background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-indigo-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] bg-purple-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-2xl">
        <div className="flex justify-center">
          <div className="p-4 bg-indigo-600 text-white rounded-3xl shadow-2xl shadow-indigo-500/40">
            <ShoppingCart size={48} strokeWidth={2.5} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Next.js E-Commerce <br />
            <span className="text-indigo-600">Secure Authentication</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A premium full-stack authentication system for users and administrators. 
            Built with TypeScript, Tailwind CSS, and Next.js 15.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* User Side Link */}
          <Link href="/auth/signup">
            <div className="glass group p-6 rounded-3xl text-left hover:border-indigo-500/50 transition-all cursor-pointer">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">User Access</h3>
              <p className="text-sm text-slate-500 mb-4">Register as a customer, verify your account via OTP, and manage your orders.</p>
              <Button variant="ghost" className="p-0 text-indigo-600 group-hover:pl-2 transition-all" rightIcon={<ArrowRight size={18} />}>
                Get Started
              </Button>
            </div>
          </Link>

          {/* Admin Side Link */}
          <Link href="/auth/login">
            <div className="glass group p-6 rounded-3xl text-left hover:border-indigo-500/50 transition-all cursor-pointer">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Admin Portal</h3>
                <ShieldCheck size={18} className="text-indigo-600" />
              </div>
              <p className="text-sm text-slate-500 mb-4">Secure administrator login to manage products, customers, and site settings.</p>
              <Button variant="ghost" className="p-0 text-indigo-600 group-hover:pl-2 transition-all" rightIcon={<ArrowRight size={18} />}>
                Secure Login
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
