import React, { useState } from 'react';
import { Budget, BudgetWithSpending, ExpenseCategory } from '../types';
import { formatINR } from '../data/mockData';
import {
  PieChart,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface BudgetSectionProps {
  budgets: Budget[];
  categoryBudgets: BudgetWithSpending[];
  overallBudget: BudgetWithSpending | undefined;
  onUpdateBudget: (category: string, newAmount: number) => void;
  onAddBudget: (category: string, allocatedAmount: number) => void;
  onDeleteBudget: (budgetId: string | number) => void;
}

const AVAILABLE_CATEGORIES: ExpenseCategory[] = [
  'Food & Dining',
  'Rent & Utilities',
  'Transport',
  'Shopping',
  'Health',
  'Entertainment',
  'Bills',
  'Miscellaneous',
];

export const BudgetSection: React.FC<BudgetSectionProps> = ({
  budgets,
  categoryBudgets,
  overallBudget,
  onUpdateBudget,
  onAddBudget,
  onDeleteBudget,
}) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState<string>('Bills');
  const [newAmount, setNewAmount] = useState<string>('5000');

  const startEdit = (category: string, currentAmount: number) => {
    setEditingCategory(category);
    setEditAmount(currentAmount.toString());
  };

  const handleSaveEdit = (category: string) => {
    const val = parseFloat(editAmount);
    if (!isNaN(val) && val >= 0) {
      onUpdateBudget(category, val);
    }
    setEditingCategory(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newAmount);
    if (!isNaN(val) && val > 0 && newCategory) {
      onAddBudget(newCategory, val);
      setShowAddForm(false);
      setNewAmount('5000');
    }
  };

  const getStatusBadge = (status: BudgetWithSpending['status']) => {
    switch (status) {
      case 'exceeded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <ShieldAlert className="w-3.5 h-3.5" /> Exceeded Limit
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <AlertTriangle className="w-3.5 h-3.5" /> Approaching Cap
          </span>
        );
      case 'on_track':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="w-3.5 h-3.5" /> Safe / On Track
          </span>
        );
    }
  };

  const categoriesOnly = categoryBudgets.filter((b) => b.category !== 'Overall');

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Budget Management & Target Limits
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Configure monthly expenditure limits across categories and protect your savings rate.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'New Category Budget'}</span>
        </button>
      </div>

      {/* Add New Budget Category Form Drawer */}
      {showAddForm && (
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-900/60 shadow-md animate-in fade-in">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" /> Create Category Budget
          </h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {AVAILABLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Monthly Cap (₹)
              </label>
              <input
                type="number"
                min="500"
                step="500"
                required
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="5000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Save Budget
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Primary Overall Monthly Cap Hero Card */}
      {overallBudget && (
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Master Threshold
              </span>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Total Monthly Budget Cap
              </h3>
            </div>
            <div className="flex items-center gap-3">
              {editingCategory === 'Overall' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-28 px-2 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                  <button
                    onClick={() => handleSaveEdit('Overall')}
                    className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="px-2 py-1 text-stone-400 hover:text-stone-600 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEdit('Overall', overallBudget.allocatedAmount)}
                  className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 border border-stone-200 dark:border-stone-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" /> Adjust Total Limit
                </button>
              )}
              {getStatusBadge(overallBudget.status)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
              <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                Allocated Cap
              </p>
              <p className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                {formatINR(overallBudget.allocatedAmount)}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
              <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                Current Consumption
              </p>
              <p className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                {formatINR(overallBudget.spentAmount)}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
              <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                Remaining Safety Buffer
              </p>
              <p
                className={`text-xl font-bold mt-1 ${
                  overallBudget.remainingAmount < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {overallBudget.remainingAmount < 0
                  ? `-${formatINR(Math.abs(overallBudget.remainingAmount))}`
                  : formatINR(overallBudget.remainingAmount)}
              </p>
            </div>
          </div>

          <div className="w-full bg-stone-100 dark:bg-stone-800 h-3 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                overallBudget.status === 'exceeded'
                  ? 'bg-rose-500'
                  : overallBudget.status === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(overallBudget.percentageUsed, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-stone-500 dark:text-stone-400">
            <span>{overallBudget.percentageUsed.toFixed(1)}% of maximum monthly allocation used</span>
            <span>Billing cycle: Current Month</span>
          </div>
        </div>
      )}

      {/* Individual Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoriesOnly.map((cat) => {
          const rawBudget = budgets.find((b) => b.category === cat.category);
          const isEditing = editingCategory === cat.category;

          return (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                      {cat.category}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {formatINR(cat.spentAmount)} spent
                    </p>
                  </div>
                  {getStatusBadge(cat.status)}
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                    <button
                      onClick={() => handleSaveEdit(cat.category)}
                      className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="px-2 py-1 text-stone-400 hover:text-stone-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      {formatINR(cat.allocatedAmount)}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      {cat.remainingAmount >= 0
                        ? `${formatINR(cat.remainingAmount)} left`
                        : `Over by ${formatINR(Math.abs(cat.remainingAmount))}`}
                    </span>
                  </div>
                )}

                <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      cat.status === 'exceeded'
                        ? 'bg-rose-500'
                        : cat.status === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(cat.percentageUsed, 100)}%` }}
                  />
                </div>

                <p className="text-[11px] text-stone-400 font-mono">
                  {cat.percentageUsed.toFixed(0)}% consumed
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <button
                  onClick={() => startEdit(cat.category, cat.allocatedAmount)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" /> Edit Limit
                </button>
                {rawBudget && (
                  <button
                    onClick={() => onDeleteBudget(rawBudget.id)}
                    className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 transition-colors cursor-pointer"
                    title="Delete category budget"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
