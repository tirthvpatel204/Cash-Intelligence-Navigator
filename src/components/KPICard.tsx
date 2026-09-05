import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  amount: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'emerald' | 'amber' | 'rose' | 'indigo' | 'stone';
  badgeText?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  amount,
  subtitle,
  icon: Icon,
  variant = 'stone',
  badgeText,
}) => {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300',
      amountColor: 'text-emerald-700 dark:text-emerald-400',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      border: 'border-rose-200 dark:border-rose-800/60',
      iconBg: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-300',
      amountColor: 'text-rose-700 dark:text-rose-400',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800/60',
      iconBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-300',
      amountColor: 'text-amber-700 dark:text-amber-400',
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      border: 'border-indigo-200 dark:border-indigo-800/60',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300',
      badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/80 dark:text-indigo-300',
      amountColor: 'text-indigo-700 dark:text-indigo-400',
    },
    stone: {
      bg: 'bg-white dark:bg-stone-900',
      border: 'border-stone-200 dark:border-stone-800',
      iconBg: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300',
      badge: 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300',
      amountColor: 'text-stone-900 dark:text-stone-100',
    },
  };

  const currentVariant = colorMap[variant] || colorMap.stone;

  return (
    <div
      className={`rounded-2xl p-5 border transition-all shadow-xs ${currentVariant.bg} ${currentVariant.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className={`text-2xl font-bold tracking-tight mt-1.5 ${currentVariant.amountColor}`}>
            {amount}
          </h3>
        </div>
        <div className={`p-2.5 rounded-xl ${currentVariant.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-stone-800/60 text-xs">
        <span className="text-stone-500 dark:text-stone-400 truncate">
          {subtitle}
        </span>
        {badgeText && (
          <span className={`px-2 py-0.5 rounded-md font-medium text-[11px] shrink-0 ${currentVariant.badge}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};
