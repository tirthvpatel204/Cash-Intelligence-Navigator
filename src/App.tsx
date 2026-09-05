import { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  CURRENT_MONTH_STR,
  formatINR,
  computeDashboardMetrics,
  computeCategoryBudgets,
  generateSmartInsights,
} from './data/mockData';
import { Transaction, Budget, SavingsGoal, User, ActiveSection } from './types';
import { Navbar } from './components/Navbar';
import { KPICard } from './components/KPICard';
import { BudgetOverview } from './components/BudgetOverview';
import { BudgetSection } from './components/BudgetSection';
import { MonthlyAnalysis } from './components/MonthlyAnalysis';
import { SmartInsightsBanner } from './components/SmartInsightsBanner';
import { SavingsGoalsCard } from './components/SavingsGoalsCard';
import { RecentTransactionsTable } from './components/RecentTransactionsTable';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AuthModal } from './components/AuthModal';
import { exportTransactionsPDF } from './utils/pdfExport';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Download,
} from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sbt_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sbt_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sbt_theme', 'light');
    }
  }, [darkMode]);

  // Auth User State
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 1,
    fullName: 'Priya Sharma',
    email: 'priya@example.com',
  });
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Active Navigation Section
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');

  // Core Mock States - Starting at zero transactions for clean slate testing
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [goals, setGoals] = useState<SavingsGoal[]>(INITIAL_GOALS);
  const [selectedMonth] = useState<string>(CURRENT_MONTH_STR);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedAllBanner, setAddedAllBanner] = useState(false);

  // Computed Financial Metrics & Dynamic Insights
  const metrics = useMemo(
    () => computeDashboardMetrics(transactions, budgets, selectedMonth),
    [transactions, budgets, selectedMonth]
  );

  const categoryBudgets = useMemo(
    () => computeCategoryBudgets(transactions, budgets, selectedMonth),
    [transactions, budgets, selectedMonth]
  );

  const overallBudget = useMemo(
    () => categoryBudgets.find((b) => b.category === 'Overall'),
    [categoryBudgets]
  );

  const smartInsights = useMemo(
    () => generateSmartInsights(transactions, budgets, selectedMonth),
    [transactions, budgets, selectedMonth]
  );

  // Quick Action Handlers
  const handleAddAllSample = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setAddedAllBanner(true);
    setTimeout(() => setAddedAllBanner(false), 3000);
  };

  const handleResetToZero = () => {
    setTransactions([]);
  };

  const handleExportPDF = () => {
    exportTransactionsPDF(
      transactions,
      metrics,
      currentUser?.fullName || 'Priya Sharma',
      'September 2026'
    );
  };

  const handleAddQuick = (
    type: 'income' | 'expense',
    category: string,
    amount: number,
    description: string,
    method: 'UPI' | 'Net Banking'
  ) => {
    const newTx: Transaction = {
      id: Date.now(),
      userId: currentUser?.id || 1,
      type,
      category,
      amount,
      paymentMethod: method,
      transactionDate: new Date().toISOString().split('T')[0],
      description,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleAddTransaction = (newTxData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddDeposit = (goalId: number, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updatedAmount = g.currentAmount + amount;
          return {
            ...g,
            currentAmount: updatedAmount,
            status: updatedAmount >= g.targetAmount ? 'completed' : 'in_progress',
          };
        }
        return g;
      })
    );
  };

  // Budget modification handlers
  const handleUpdateBudget = (category: string, newAmount: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.category === category ? { ...b, allocatedAmount: newAmount } : b))
    );
  };

  const handleAddBudget = (category: string, allocatedAmount: number) => {
    setBudgets((prev) => {
      const existing = prev.find((b) => b.category === category);
      if (existing) {
        return prev.map((b) => (b.category === category ? { ...b, allocatedAmount } : b));
      }
      return [
        ...prev,
        {
          id: Date.now(),
          userId: currentUser?.id || 1,
          category,
          monthYear: CURRENT_MONTH_STR,
          allocatedAmount,
        },
      ];
    });
  };

  const handleDeleteBudget = (budgetId: number) => {
    setBudgets((prev) => prev.filter((b) => b.id !== budgetId));
  };

  const incomeCount = transactions.filter((t) => t.type === 'income').length;
  const expenseCount = transactions.filter((t) => t.type === 'expense').length;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans antialiased transition-colors">
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        selectedMonth="September 2026"
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onExportPDF={handleExportPDF}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome & Quick Action Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              {activeSection === 'dashboard' && 'Financial Cockpit'}
              {activeSection === 'budgets' && 'Budget Management'}
              {activeSection === 'analysis' && 'Monthly Financial Analysis'}
              {activeSection === 'transactions' && 'Transactions Ledger'}
              {activeSection === 'goals' && 'Savings Goals'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              {activeSection === 'dashboard' &&
                `Welcome back, ${currentUser?.fullName || 'Guest'}. Real-time tracking for cash flow, budgets, and savings.`}
              {activeSection === 'budgets' &&
                'Configure category spending caps and monitor limits in real time.'}
              {activeSection === 'analysis' &&
                'Comprehensive breakdown of spending velocity, category shares, and payment channels.'}
              {activeSection === 'transactions' &&
                'Search, filter, record, and export complete transaction history.'}
              {activeSection === 'goals' &&
                'Track progress toward major life milestones and deposit reserves.'}
            </p>
          </div>

          {/* Core controls: Add All, Reset to 0, Export PDF, Record Single */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer shadow-xs"
              title="Download Statement of all transactions in PDF format"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export PDF</span>
            </button>

            {transactions.length === 0 ? (
              <button
                onClick={handleAddAllSample}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>+ Add All Workshop Records</span>
              </button>
            ) : (
              <button
                onClick={handleResetToZero}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer shadow-xs"
                title="Reset balance, income and all expenses to zero"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All to ₹0</span>
              </button>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record Entry</span>
            </button>
          </div>
        </div>

        {/* Quick-Add Shortcut Pill Bar */}
        <div className="p-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Quick Shortcuts:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() =>
                handleAddQuick(
                  'income',
                  'Salary',
                  65000,
                  'Monthly payroll credit',
                  'Net Banking'
                )
              }
              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 font-medium transition-colors cursor-pointer"
            >
              + Salary (₹65k)
            </button>
            <button
              onClick={() =>
                handleAddQuick(
                  'income',
                  'Freelance',
                  15000,
                  'Client UI Design Payout',
                  'UPI'
                )
              }
              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 font-medium transition-colors cursor-pointer"
            >
              + Freelance (₹15k)
            </button>
            <button
              onClick={() =>
                handleAddQuick(
                  'expense',
                  'Rent & Utilities',
                  16000,
                  'Apartment rent transfer',
                  'Net Banking'
                )
              }
              className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/80 font-medium transition-colors cursor-pointer"
            >
              - Rent (₹16k)
            </button>
            <button
              onClick={() =>
                handleAddQuick(
                  'expense',
                  'Food & Dining',
                  3200,
                  'Weekly groceries D-Mart',
                  'UPI'
                )
              }
              className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/80 font-medium transition-colors cursor-pointer"
            >
              - Food (₹3.2k)
            </button>

            {transactions.length < INITIAL_TRANSACTIONS.length && (
              <button
                onClick={handleAddAllSample}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 font-semibold transition-colors cursor-pointer"
              >
                + Add All 10 Records
              </button>
            )}
          </div>
        </div>

        {/* Temporary toast confirmation when All is added */}
        {addedAllBanner && (
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All 10 workshop
              records loaded: Total Balance, Monthly Income, Expenses, and Budgets
              calculated!
            </span>
            <button
              onClick={() => setAddedAllBanner(false)}
              className="text-emerald-700 hover:text-emerald-950 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* SECTION 1: DASHBOARD VIEW */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            {/* 4 Primary Financial KPI Stat Cards */}
            <section aria-label="Key Performance Indicators">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                  title="Net Balance"
                  amount={formatINR(metrics.totalBalance)}
                  subtitle="Cash in hand & bank accounts"
                  icon={Wallet}
                  variant={metrics.totalBalance > 0 ? 'emerald' : 'stone'}
                  badgeText={metrics.totalBalance === 0 ? '₹0.00' : 'Active'}
                />
                <KPICard
                  title="Monthly Income"
                  amount={formatINR(metrics.totalMonthlyIncome)}
                  subtitle="Total credits this cycle"
                  icon={TrendingUp}
                  variant={metrics.totalMonthlyIncome > 0 ? 'emerald' : 'stone'}
                  badgeText={`${incomeCount} Credits`}
                />
                <KPICard
                  title="Monthly Expenses"
                  amount={formatINR(metrics.totalMonthlyExpenses)}
                  subtitle={`${expenseCount} Debits logged`}
                  icon={TrendingDown}
                  variant={
                    metrics.overallBudgetStatus === 'exceeded'
                      ? 'rose'
                      : metrics.totalMonthlyExpenses > 0
                      ? 'amber'
                      : 'stone'
                  }
                  badgeText={`${metrics.overallBudgetPercentage.toFixed(0)}% of Budget`}
                />
                <KPICard
                  title="Net Savings"
                  amount={formatINR(metrics.netSavings)}
                  subtitle="Income surplus retained"
                  icon={PiggyBank}
                  variant={
                    metrics.netSavings > 0
                      ? 'indigo'
                      : metrics.netSavings < 0
                      ? 'rose'
                      : 'stone'
                  }
                  badgeText={
                    metrics.totalMonthlyIncome > 0
                      ? `${((metrics.netSavings / metrics.totalMonthlyIncome) * 100).toFixed(0)}% Rate`
                      : '₹0.00'
                  }
                />
              </div>
            </section>

            {/* Smart Insights Banner */}
            <section aria-label="Smart Insights">
              <SmartInsightsBanner insights={smartInsights} />
            </section>

            {/* Mid Section: Budgets Overview & Savings Goals */}
            <section
              aria-label="Budgets and Goals"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              <div className="lg:col-span-7">
                <BudgetOverview
                  categoryBudgets={categoryBudgets}
                  overallBudget={overallBudget}
                />
              </div>
              <div className="lg:col-span-5">
                <SavingsGoalsCard goals={goals} onAddDeposit={handleAddDeposit} />
              </div>
            </section>

            {/* Bottom Section: Recent Transactions Ledger */}
            <section aria-label="Transactions History">
              <RecentTransactionsTable
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
                onOpenAddModal={() => setIsModalOpen(true)}
                onAddAllSample={handleAddAllSample}
                onExportPDF={handleExportPDF}
              />
            </section>
          </div>
        )}

        {/* SECTION 2: DEDICATED BUDGET SECTION */}
        {activeSection === 'budgets' && (
          <BudgetSection
            budgets={budgets}
            categoryBudgets={categoryBudgets}
            overallBudget={overallBudget}
            onUpdateBudget={handleUpdateBudget}
            onAddBudget={handleAddBudget}
            onDeleteBudget={handleDeleteBudget}
          />
        )}

        {/* SECTION 3: MONTHLY ANALYSIS SECTION */}
        {activeSection === 'analysis' && (
          <MonthlyAnalysis
            transactions={transactions}
            metrics={metrics}
            userName={currentUser?.fullName}
          />
        )}

        {/* SECTION 4: DEDICATED TRANSACTIONS SECTION */}
        {activeSection === 'transactions' && (
          <section aria-label="Transactions History">
            <RecentTransactionsTable
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenAddModal={() => setIsModalOpen(true)}
              onAddAllSample={handleAddAllSample}
              onExportPDF={handleExportPDF}
            />
          </section>
        )}

        {/* SECTION 5: DEDICATED SAVINGS GOALS SECTION */}
        {activeSection === 'goals' && (
          <div className="max-w-3xl mx-auto">
            <SavingsGoalsCard goals={goals} onAddDeposit={handleAddDeposit} />
          </div>
        )}
      </main>

      {/* Entry Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      {/* Authentication Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
      />
    </div>
  );
}
