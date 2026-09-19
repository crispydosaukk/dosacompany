'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle, Copy, Check, ChevronRight } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import { useRouter } from 'next/navigation';

type LoginForm = { email: string; password: string; rememberMe: boolean };

type DemoRole = { role: string; email: string; password: string; badge: string };

const DEMO_ACCOUNTS: DemoRole[] = [
  { role: 'Super Admin', email: 'admin@dosacompany.co.uk', password: 'DosaAdmin2026!', badge: 'bg-primary/10 text-primary' },
  { role: 'Restaurant Manager', email: 'manager@dosacompany.co.uk', password: 'Manager2026!', badge: 'bg-secondary/10 text-secondary' },
  { role: 'Staff', email: 'staff@dosacompany.co.uk', password: 'Staff2026!', badge: 'bg-blue-100 text-blue-700' },
];

export default function AdminLoginClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setAuthError('');
    // Backend integration: POST /api/admin/auth/login
    // Validate credentials against admins table, return JWT/session
    await new Promise((r) => setTimeout(r, 1400));

    const validAccount = DEMO_ACCOUNTS.find(
      (a) => a.email === data.email && a.password === data.password
    );

    if (validAccount) {
      router.push('/admin-dashboard');
    } else {
      setIsLoading(false);
      setAuthError('Invalid credentials — use the demo accounts below to sign in.');
    }
  };

  const fillCredentials = (account: DemoRole) => {
    setValue('email', account.email);
    setValue('password', account.password);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #111111 0%, #1a0a0a 50%, #0a1a0a 100%)' }}>
        <div className="absolute inset-0">
          {/* Decorative circles */}
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ED2024, transparent)' }} />
          <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #10984B, transparent)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #ED2024, transparent)' }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          <div className="flex items-center gap-3 mb-12">
            <AppLogo size={48} />
            <div>
              <div className="text-white font-extrabold text-2xl">Dosa Company</div>
              <div className="text-secondary text-sm font-medium">Restaurant Management</div>
            </div>
          </div>

          <h1 className="text-white font-extrabold text-4xl leading-tight mb-4">
            Welcome to<br />
            <span className="text-primary">your kitchen</span><br />
            command centre
          </h1>
          <p className="text-gray-400 text-base leading-relaxed mb-10">
            Manage orders, tables, menu and EPOS integration for Dosa Company — Milton Keynes & Tolworth.
          </p>

          <div className="space-y-4">
            {[
              { icon: '🍽️', label: 'Live order management', desc: 'Real-time kitchen & EPOS status' },
              { icon: '📱', label: 'QR table ordering', desc: '30 tables with unique QR codes' },
              { icon: '💳', label: 'Stripe payments', desc: 'Secure online payment processing' },
            ].map((feat) => (
              <div key={`feat-${feat.label}`} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  {feat.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{feat.label}</p>
                  <p className="text-gray-500 text-xs">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <AppLogo size={40} />
            <span className="font-extrabold text-xl text-foreground">Dosa Company</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-foreground mb-2">Admin Sign In</h2>
            <p className="text-muted-foreground">Access the restaurant management dashboard</p>
          </div>

          {authError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@dosacompany.co.uk"
                  className={`form-input pl-10 ${errors.email ? 'form-input-error' : ''}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                  })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`form-input pl-10 pr-12 ${errors.password ? 'form-input-error': ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border accent-primary"
                  {...register('rememberMe')}
                />
                <span className="text-sm text-foreground">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary font-semibold hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary text-base py-3.5"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium px-2">Demo Accounts</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="bg-muted/50 border border-border rounded-2xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border">
                <p className="text-xs text-muted-foreground">Click any row to autofill credentials</p>
              </div>
              {DEMO_ACCOUNTS.map((account, idx) => (
                <div
                  key={`demo-${account.role}`}
                  className={`px-4 py-3 flex items-center justify-between gap-3 hover:bg-white transition-colors cursor-pointer ${idx < DEMO_ACCOUNTS.length - 1 ? 'border-b border-border' : ''}`}
                  onClick={() => fillCredentials(account)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${account.badge}`}>
                      {account.role}
                    </span>
                    <span className="text-xs text-muted-foreground truncate font-mono">{account.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(account.email, `email-${idx}`); }}
                      className="w-7 h-7 rounded-lg hover:bg-border flex items-center justify-center transition-colors"
                      aria-label="Copy email"
                    >
                      {copiedField === `email-${idx}` ? <Check size={13} className="text-secondary" /> : <Copy size={13} className="text-muted-foreground" />}
                    </button>
                    <span className="text-xs text-muted-foreground font-mono">{account.password}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Dosa Company Restaurant Management System · v2.1.0
          </p>
        </div>
      </div>
    </div>
  );
}