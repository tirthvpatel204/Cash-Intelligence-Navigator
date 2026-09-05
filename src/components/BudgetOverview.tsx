import React from 'react';
import { BudgetWithSpending } from '../types';
import { formatINR } from '../data/mockData';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface BudgetOverviewProps {
  categoryBudgets: BudgetWithSpending[];
  overallBudget: BudgetWithSpending | undefined;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  categoryBudgets,
  overallBudget,
}) => {
  const getStatusBadge = (status: BudgetWithSpending['status']) => {
    switch (status) {
      case 'exceeded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <ShieldAlert className="w-3 h-3" /> Exceeded
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <AlertTriangle className="w-3 h-3" /> Caution
          </span>
        );
      case 'on_track':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="w-3 h-3" /> On Track
          </span>
        );
    }
  };

  const getProgressBarColor = (status: BudgetWithSpending['status']) => {
    switch (status) {
      case 'exceeded':
        return 'bg-rose-500';
      case 'warning':
        return 'bg-amber-500';
      case 'on_track':
      default:
        return 'bg-emerald-500';
    }
  };

  const categoriesOnly = categoryBudgets.filter((b) => b.category !== 'Overall');

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
            Budget Allocations
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Current month spending vs. predetermined caps
          </p>
        </div>
        {overallBudget && getStatusBadge(overallBudget.status)}
      </div>

      {/* Overall monthly budget block */}
      {overallBudget && (
        <div className="mb-6 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-stone-700 dark:text-stone-300">
              Total Monthly Budget Limit
            </span>
            <span className="text-stone-900 dark:text-stone-100">
              {formatINR(overallBudget.spentAmount)} / {formatINR(overallBudget.allocatedAmount)}
            </span>
          </div>

          <div className="w-full bg-stone-200 dark:bg-stone-700 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${getProgressBarColor(
                overallBudget.status
              )}`}
              style={{ width: `${Math.min(overallBudget.percentageUsed, 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-stone-500 dark:text-stone-400 mt-2 font-medium">
            <span>{overallBudget.percentageUsed.toFixed(1)}% consumed</span>
            <span>
              {overallBudget.remainingAmount >= 0
                ? `${formatINR(overallBudget.remainingAmount)} remaining`
                : `${formatINR(Math.abs(overallBudget.remainingAmount))} over budget`}
            </span>
          </div>
        </div>
      )}

      {/* Category Wise Breakdown */}
      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3">
        Category Limits
      </h4>

      <div className="space-y-4">
        {categoriesOnly.map((cat) => (
          <div key={cat.id} className="text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-medium text-stone-800 dark:text-stone-200">
                {cat.category}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-stone-600 dark:text-stone-400 font-mono text-[11px]">
                  {formatINR(cat.spentAmount)} / {formatINR(cat.allocatedAmount)}
                </span>
                {getStatusBadge(cat.status)}
              </div>
            </div>

            <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${getProgressBarColor(
                  cat.status
                )}`}
                style={{ width: `${Math.min(cat.percentageUsed, 100)}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-stone-400 mt-1">
              <span>{cat.percentageUsed.toFixed(0)}% utilized</span>
              <span>
                {cat.remainingAmount >= 0
                  ? `${formatINR(cat.remainingAmount)} left`
                  : `Exceeded by ${formatINR(Math.abs(cat.remainingAmount))}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
