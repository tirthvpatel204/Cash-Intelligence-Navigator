import React from 'react';
import { SavingsGoal } from '../types';
import { formatINR } from '../data/mockData';
import { Target, CheckCircle2, Plus } from 'lucide-react';

interface SavingsGoalsCardProps {
  goals: SavingsGoal[];
  onAddDeposit: (goalId: number, amount: number) => void;
}

export const SavingsGoalsCard: React.FC<SavingsGoalsCardProps> = ({
  goals,
  onAddDeposit,
}) => {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
              Savings Targets
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Active milestones & deposit progress
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const percentage = Math.min(
            100,
            goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
          );
          const isCompleted = goal.status === 'completed' || percentage >= 100;

          return (
            <div
              key={goal.id}
              className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                    {goal.goalName}
                  </h4>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Met
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400">
                      Due {goal.targetDate}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <div className="flex justify-between items-baseline text-xs mb-1.5">
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      {formatINR(goal.currentAmount)}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400 text-[11px]">
                      Target: {formatINR(goal.targetAmount)}
                    </span>
                  </div>

                  <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-indigo-600 dark:bg-indigo-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-right text-[10px] text-stone-400 mt-1">
                    {percentage.toFixed(0)}% saved
                  </div>
                </div>
              </div>

              {!isCompleted && (
                <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Quick Save
                  </span>
                  <button
                    onClick={() => onAddDeposit(goal.id, 2000)}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> +₹2,000
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
