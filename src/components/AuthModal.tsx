import React, { useState } from 'react';
import { User } from '../types';
import { Wallet, Lock, Mail, User as UserIcon, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const newUser: User = {
        id: Date.now(),
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
      };
      onLogin(newUser);
      onClose();
    } else {
      // Login mode
      const loggedUser: User = {
        id: 1,
        fullName: fullName.trim() || 'Priya Sharma',
        email: email.trim().toLowerCase(),
      };
      onLogin(loggedUser);
      onClose();
    }
  };

  const handleDemoLogin = (demoName: string, demoEmail: string) => {
    onLogin({
      id: 1,
      fullName: demoName,
      email: demoEmail,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                {currentUser
                  ? 'Active Account Session'
                  : mode === 'login'
                  ? 'Welcome to Smart Budget'
                  : 'Create Your FinTech Account'}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {currentUser
                  ? 'PHP Session & User Data Isolation'
                  : 'Core PHP PDO Prepared Auth Simulation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* If Already Logged in */}
        {currentUser ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-base">
                  {currentUser.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {currentUser.fullName}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {currentUser.email}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                    <ShieldCheck className="w-3 h-3" /> Session Active (UID #{currentUser.id})
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-stone-500 dark:text-stone-400 bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
              Your financial records, budgets, and savings goals are strictly linked to your user account ID.
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Continue Working
              </button>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        ) : (
          /* Login / Signup Tabs & Form */
          <div>
            <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {mode === 'signup' && (
                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
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
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>{mode === 'login' ? 'Sign In to Tracker' : 'Register Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-center">
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-2">
                Workshop Quick-Fill:
              </p>
              <button
                type="button"
                onClick={() => handleDemoLogin('Priya Sharma', 'priya@example.com')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                ⚡ Fill Demo Account (Priya Sharma)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
