import React, { useState } from 'react';
import { Wallet, Lock, Mail, User as UserIcon, ArrowRight, Loader2, ShieldCheck, Moon, Sun, Sparkles, Database, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { registerWithEmail, loginWithEmail, loginAnonymously, loginWithGoogle } from '../lib/firebase';
import { supabaseSignUp, supabaseSignIn } from '../lib/supabase';

interface LoginPageProps {
  onLogin: (user: User) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  darkMode,
  onToggleDarkMode,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Quick Guest Profile Customization modal/state
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [guestName, setGuestName] = useState('');

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      const googleUser = await loginWithGoogle();
      onLogin(googleUser);
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      let msg = err?.message || 'Google sign-in could not be completed.';
      if (err?.code === 'auth/popup-blocked') {
        msg = 'Sign-in popup was blocked by your browser. Please allow popups for this site or use email.';
      } else if (err?.code === 'auth/popup-closed-by-user') {
        msg = 'Google sign-in popup was closed before completing.';
      } else if (err?.code === 'auth/cancelled-popup-request') {
        msg = 'Google sign-in was cancelled.';
      } else if (err?.code === 'auth/unauthorized-domain') {
        msg = 'This domain is pending Google OAuth domain registration. You can sign in using email or Quick Demo.';
      }
      setError(msg);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          setError('Please enter your full name for your profile.');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match. Please re-enter.');
          setIsLoading(false);
          return;
        }

        let registeredUser: User;
        try {
          registeredUser = await supabaseSignUp(email.trim(), password, fullName.trim());
        } catch (supaErr: any) {
          console.warn('Supabase signup fallback to Firebase:', supaErr?.message);
          registeredUser = await registerWithEmail(email.trim(), password, fullName.trim());
        }

        onLogin(registeredUser);
      } else {
        // Log in
        let loggedUser: User;
        try {
          loggedUser = await supabaseSignIn(email.trim(), password);
        } catch (supaErr: any) {
          console.warn('Supabase sign in fallback to Firebase:', supaErr?.message);
          loggedUser = await loginWithEmail(email.trim(), password);
        }

        onLogin(loggedUser);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed. Please verify your credentials.';
      if (err.code === 'auth/email-already-in-use' || err.message?.includes('already registered')) {
        msg = 'This email is already registered. Please click "Sign In" instead.';
      } else if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found' ||
        err.message?.includes('Invalid login')
      ) {
        msg = 'Invalid email or password. Please verify and try again.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLoginWithCustomName = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const chosenName = guestName.trim() || 'Guest Member';
    setIsLoading(true);
    setError('');

    try {
      let guest: User;
      try {
        guest = await loginAnonymously();
        guest.fullName = chosenName;
      } catch (err) {
        // Fallback to locally persistent guest session
        guest = {
          id: 'user_' + Date.now().toString(36),
          fullName: chosenName,
          email: `${chosenName.toLowerCase().replace(/\s+/g, '.')}@cloudbudget.local`,
        };
      }
      onLogin(guest);
    } catch (err: any) {
      console.error('Guest access error:', err);
      onLogin({
        id: 'user_' + Date.now(),
        fullName: chosenName,
        email: 'user@cloudbudget.local',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col justify-between transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-stone-200 dark:border-stone-800/80 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-stone-900 dark:text-stone-100">
                  Smart Budget Tracker
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  FinTech Cloud
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
                Secure Personal Wealth & Multi-Device Finance Ledger
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleDarkMode}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 transition-colors cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content / Auth Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          {/* Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-stone-200/50 dark:shadow-none">
            {/* Title & Badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 mb-3">
                <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Dedicated Cloud Database & Profile</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                {mode === 'login' ? 'Sign In to Your Account' : 'Create Your Profile'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                {mode === 'login'
                  ? 'Access your transactions, category budgets, and savings goals.'
                  : 'Register your own separate account and personalized financial ledger.'}
              </p>
            </div>

            {/* Mode Toggle Tabs */}
            <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl mb-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            {/* Continue with Google */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading || isGoogleLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium flex items-center justify-center gap-2.5 shadow-xs hover:border-stone-300 dark:hover:border-stone-600 transition-all cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-stone-500" />
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-4 h-4 shrink-0" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200 dark:border-stone-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                  <span className="bg-white dark:bg-stone-900 px-2.5 text-stone-400 font-medium">
                    or continue with email
                  </span>
                </div>
              </div>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {mode === 'signup' && (
                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arjun Patel"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">This name will appear across your personal dashboard and PDF reports.</p>
                </div>
              )}

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting Secure Profile...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create My Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Instant Demo Option with Custom Name */}
            <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800 text-center">
              {!showGuestPrompt ? (
                <div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-2">
                    Want to test without registering an email?
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowGuestPrompt(true)}
                    className="w-full py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>⚡ Quick Demo with Your Own Name</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleGuestLoginWithCustomName} className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-left space-y-2">
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
                    Enter your name for the demo:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Johnson"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      Start
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGuestPrompt(false)}
                    className="text-[10px] text-stone-400 hover:underline"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Value Props & Guarantees */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-stone-800 dark:text-stone-200">Isolated Data</p>
              <p className="text-[10px] text-stone-400">Private per user ID</p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/80">
              <Database className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-stone-800 dark:text-stone-200">Cloud Synced</p>
              <p className="text-[10px] text-stone-400">Live Postgres DB</p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-stone-800 dark:text-stone-200">PDF Ready</p>
              <p className="text-[10px] text-stone-400">Personalized exports</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-stone-400 border-t border-stone-200 dark:border-stone-800">
        Smart Budget Tracker • FinTech Security & Real-Time Cloud Engine
      </footer>
    </div>
  );
};
