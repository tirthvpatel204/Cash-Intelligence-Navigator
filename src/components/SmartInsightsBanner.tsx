import React from 'react';
import { SmartInsight } from '../types';
import { Sparkles, AlertTriangle, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';

interface SmartInsightsBannerProps {
  insights: SmartInsight[];
}

export const SmartInsightsBanner: React.FC<SmartInsightsBannerProps> = ({ insights }) => {
  if (insights.length === 0) return null;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
          Smart Spending Insights
        </h3>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 ml-auto">
          Rule-based Analysis
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map((insight) => {
          let borderClass = 'border-stone-200 dark:border-stone-800';
          let bgClass = 'bg-stone-50 dark:bg-stone-800/40';
          let icon = <AlertCircle className="w-4 h-4 text-stone-500" />;

          if (insight.type === 'alert') {
            borderClass = 'border-rose-200 dark:border-rose-900/60';
            bgClass = 'bg-rose-50/70 dark:bg-rose-950/20';
            icon = <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />;
          } else if (insight.type === 'warning') {
            borderClass = 'border-amber-200 dark:border-amber-900/60';
            bgClass = 'bg-amber-50/70 dark:bg-amber-950/20';
            icon = <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
          } else if (insight.type === 'positive') {
            borderClass = 'border-emerald-200 dark:border-emerald-900/60';
            bgClass = 'bg-emerald-50/70 dark:bg-emerald-950/20';
            icon = <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
          } else if (insight.type === 'tip') {
            borderClass = 'border-indigo-200 dark:border-indigo-900/60';
            bgClass = 'bg-indigo-50/70 dark:bg-indigo-950/20';
            icon = <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />;
          }

          return (
            <div
              key={insight.id}
              className={`p-3.5 rounded-xl border ${borderClass} ${bgClass} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {icon}
                  <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                    {insight.title}
                  </h4>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mt-1">
                  {insight.description}
                </p>
              </div>
              {insight.metric && (
                <div className="mt-2.5 pt-2 border-t border-stone-200/60 dark:border-stone-800/60 flex justify-between items-center text-[10px] font-medium text-stone-500 dark:text-stone-400">
                  <span>Calculated indicator:</span>
                  <span className="font-semibold text-stone-700 dark:text-stone-300">
                    {insight.metric}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
