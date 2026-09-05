import React from 'react';
import { Wallet, Moon, Sun, ShieldCheck, User as UserIcon, LogIn, Download } from 'lucide-react';
import { User, ActiveSection } from '../types';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  selectedMonth: string;
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onExportPDF: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  selectedMonth,
  activeSection,
  onSelectSection,
  currentUser,
  onOpenAuth,
  onExportPDF,
}) => {
  const navItems: { id: ActiveSection; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'budgets', label: 'Budget Section' },
    { id: 'analysis', label: 'Monthly Analysis' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'goals', label: 'Savings Goals' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onSelectSection('dashboard')}
              className="flex items-center space-x-3 text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg tracking-tight text-stone-900 dark:text-stone-100">
                    Smart Budget Tracker
                  </span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    FinTech Pro
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
                  Personal Cash Flow, Budgets & Analysis
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs for Desktop */}
          <nav className="hidden md:flex items-center space-x-1 bg-stone-100/80 dark:bg-stone-800/80 p-1 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right tools: Export PDF, Month indicator, Theme toggle, Login/Signup */}
          <div className="flex items-center space-x-2.5">
            {/* Quick Export PDF button in navbar */}
            <button
              onClick={onExportPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors cursor-pointer border border-stone-200/80 dark:border-stone-700/80"
              title="Export Statement of all transactions to PDF"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={onToggleDarkMode}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600" />
              )}
            </button>

            {/* Login / Sign Up User Button */}
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 pl-2 border-l border-stone-200 dark:border-stone-800 hover:opacity-90 transition-opacity cursor-pointer text-left"
              title={currentUser ? 'Account & Session Details' : 'Login or Sign Up'}
            >
              {currentUser ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-emerald-100 flex items-center justify-center font-semibold text-xs ring-2 ring-emerald-500/20">
                    {currentUser.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-none">
                      {currentUser.fullName}
                    </p>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />{' '}
                      Active
                    </p>
                  </div>
                </>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login / Sign Up</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-stone-100 dark:border-stone-800 space-x-1 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeSection === item.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
