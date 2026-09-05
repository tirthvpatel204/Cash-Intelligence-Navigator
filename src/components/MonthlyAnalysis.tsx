import React, { useState, useMemo } from 'react';
import { Transaction, DashboardMetrics } from '../types';
import { formatINR } from '../data/mockData';
import {
  BarChart3,
  Calendar,
  CreditCard,
  PieChart as PieIcon,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Percent,
} from 'lucide-react';
import { exportTransactionsPDF } from '../utils/pdfExport';

interface MonthlyAnalysisProps {
  transactions: Transaction[];
  metrics: DashboardMetrics;
  userName?: string;
}

export const MonthlyAnalysis: React.FC<MonthlyAnalysisProps> = ({
  transactions,
  metrics,
  userName = 'Priya Sharma',
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');

  // Group by distinct months from available transactions
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => {
      const ym = t.transactionDate.substring(0, 7);
      if (ym) set.add(ym);
    });
    // Ensure 2026-09 is included
    set.add('2026-09');
    return Array.from(set).sort().reverse();
  }, [transactions]);

  // Filter transactions for selected month
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => t.transactionDate.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const monthIncome = useMemo(() => {
    return monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const monthExpense = useMemo(() => {
    return monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const monthSavings = monthIncome - monthExpense;
  const savingsRate = monthIncome > 0 ? (monthSavings / monthIncome) * 100 : 0;

  // Category breakdown for expenses
  const expenseByCategory = useMemo(() => {
    const map: { [key: string]: number } = {};
    monthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map)
      .map(([cat, amt]) => ({
        category: cat,
        amount: amt,
        pct: monthExpense > 0 ? (amt / monthExpense) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthTransactions, monthExpense]);

  // Payment method breakdown
  const paymentMethodBreakdown = useMemo(() => {
    const map: { [key: string]: { count: number; total: number } } = {};
    monthTransactions.forEach((t) => {
      if (!map[t.paymentMethod]) {
        map[t.paymentMethod] = { count: 0, total: 0 };
      }
      map[t.paymentMethod].count += 1;
      map[t.paymentMethod].total += t.amount;
    });
    return Object.entries(map).map(([method, data]) => ({
      method,
      count: data.count,
      total: data.total,
    }));
  }, [monthTransactions]);

  const handleExportThisMonth = () => {
    exportTransactionsPDF(
      monthTransactions.length > 0 ? monthTransactions : transactions,
      metrics,
      userName,
      selectedMonth
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Monthly Financial Analysis & Trends
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Detailed breakdown of earnings, cash outflow velocity, and payment channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-3 py-1.5 shadow-xs">
            <Calendar className="w-4 h-4 text-stone-500" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none cursor-pointer"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m} className="dark:bg-stone-800">
                  {m === '2026-09' ? 'September 2026 (Active)' : m}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportThisMonth}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Statement PDF</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Total Inflow
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-2">
            {formatINR(monthIncome)}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Monthly Credits
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Total Outflow
            </span>
            <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-2">
            {formatINR(monthExpense)}
          </p>
          <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
            <ArrowDownRight className="w-3 h-3" /> Total Monthly Debits
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Net Capital Retained
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <p
            className={`text-2xl font-bold mt-2 ${
              monthSavings >= 0
                ? 'text-stone-900 dark:text-stone-100'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatINR(monthSavings)}
          </p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
            Surplus saved this cycle
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Savings Rate
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {savingsRate.toFixed(1)}%
          </p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
            {savingsRate >= 20 ? 'Target benchmark reached (>20%)' : 'Below 20% target benchmark'}
          </p>
        </div>
      </div>

      {/* Split Grid: Category Share & Payment Channel velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Expense Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                Expense Allocation by Category
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Ranked by volume of spending in {selectedMonth}
              </p>
            </div>
            <PieIcon className="w-5 h-5 text-stone-400" />
          </div>

          {expenseByCategory.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-400">
              No debits or expenses logged for {selectedMonth}.
            </div>
          ) : (
            <div className="space-y-4">
              {expenseByCategory.map((item) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-800 dark:text-stone-200">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-stone-600 dark:text-stone-400">
                        {formatINR(item.amount)}
                      </span>
                      <span className="font-bold text-stone-900 dark:text-stone-100 w-12 text-right">
                        {item.pct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Channels Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                  Payment Channels
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Volume through UPI, Net Banking & Cards
                </p>
              </div>
              <CreditCard className="w-5 h-5 text-stone-400" />
            </div>

            {paymentMethodBreakdown.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">
                No payment channels recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethodBreakdown.map((item) => (
                  <div
                    key={item.method}
                    className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-stone-100">
                        {item.method}
                      </p>
                      <p className="text-[11px] text-stone-400">{item.count} Transactions</p>
                    </div>
                    <span className="font-bold font-mono text-stone-800 dark:text-stone-200">
                      {formatINR(item.total)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-6 border-t border-stone-100 dark:border-stone-800 text-center">
            <button
              onClick={handleExportThisMonth}
              className="w-full py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Full Month Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
