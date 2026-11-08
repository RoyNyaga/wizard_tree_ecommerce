'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerAdmin } from '@/lib/supabase/auth';
import { Sparkles, Lock, Mail, User, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AdminRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await registerAdmin(email, password, fullName);
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#0d0c14] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl z-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-wizard-purple-glow mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-display font-black text-2xl uppercase tracking-widest text-white">
            WIZARD TREES
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-wizard-muted mt-1">
            Create Admin Account
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-xs font-mono text-red-300 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-display font-bold text-lg text-white">Account Created!</h3>
            <p className="text-xs font-mono text-wizard-muted">
              Redirecting you to the admin workspace...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Roy Andre"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-wizard-purple-glow"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Email
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@wizardtrees.us"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-wizard-purple-glow"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-wizard-purple-glow"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 rounded-xl bg-white text-black py-3 px-6 font-mono text-xs font-bold uppercase tracking-widest hover:bg-wizard-purple-glow hover:text-white transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Registering...</span>
              ) : (
                <>
                  <span>Create Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs font-mono text-white/50">
          <span>Already have an account? </span>
          <Link
            href="/admin/login"
            className="text-wizard-purple-glow hover:underline font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

