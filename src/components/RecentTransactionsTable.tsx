import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatINR } from '../data/mockData';
import {
  ArrowDownRight,
  ArrowUpRight,
  Search,
  Trash2,
  Filter,
  PlusCircle,
  Download,
} from 'lucide-react';

interface RecentTransactionsTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: number) => void;
  onOpenAddModal: () => void;
  onAddAllSample?: () => void;
  onExportPDF?: () => void;
}

export const RecentTransactionsTable: React.FC<RecentTransactionsTableProps> = ({
  transactions,
  onDeleteTransaction,
  onOpenAddModal,
  onAddAllSample,
  onExportPDF,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = transactions.filter((t) => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      const matchMethod = t.paymentMethod.toLowerCase().includes(q);
      if (!matchDesc && !matchCat && !matchMethod) return false;
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
            Recent Transactions
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Real-time ledger with search, category filtering, and statement export
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer shadow-xs"
              title="Download Statement as PDF"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export PDF</span>
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Entry</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search memo, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 sm:flex-initial px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`flex-1 sm:flex-initial px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterType === 'income'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`flex-1 sm:flex-initial px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterType === 'expense'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            Expenses
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-medium uppercase tracking-wider">
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 hidden md:table-cell">Method</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs">
                  <div className="max-w-xs mx-auto flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mb-3">
                      <Filter className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {transactions.length === 0
                        ? 'Ledger is at ₹0.00'
                        : 'No matching transactions'}
                    </p>
                    <p className="text-stone-500 dark:text-stone-400 text-[11px] mb-4 leading-relaxed">
                      {transactions.length === 0
                        ? 'All balances and credits currently equal zero. You can populate all workshop demo entries or record a custom entry.'
                        : 'Try adjusting your search query or filter tags to see transactions.'}
                    </p>
                    {transactions.length === 0 && (
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {onAddAllSample && (
                          <button
                            onClick={onAddAllSample}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            + Add All Workshop Records
                          </button>
                        )}
                        <button
                          onClick={onOpenAddModal}
                          className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium text-xs transition-colors cursor-pointer"
                        >
                          + Record Entry
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <td className="py-3 px-3">
                    {tx.type === 'income' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <ArrowDownRight className="w-3 h-3" /> Income
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded-full">
                        <ArrowUpRight className="w-3 h-3" /> Expense
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-medium text-stone-900 dark:text-stone-100 max-w-[200px] truncate">
                    {tx.description || '—'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-stone-600 dark:text-stone-300 font-medium">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 hidden md:table-cell">
                    <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-[10px] font-mono">
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-stone-500 dark:text-stone-400 whitespace-nowrap">
                    {tx.transactionDate}
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-bold font-mono ${
                      tx.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatINR(tx.amount)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete this ${tx.type} record of ${formatINR(tx.amount)}?`
                          )
                        ) {
                          onDeleteTransaction(tx.id);
                        }
                      }}
                      className="p-1 rounded text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
