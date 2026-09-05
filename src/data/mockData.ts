import {
  Transaction,
  Budget,
  BudgetWithSpending,
  SavingsGoal,
  SmartInsight,
  DashboardMetrics,
  ExpenseCategory,
  IncomeCategory,
} from '../types';

/**
 * Formats a numeric value into the standard Indian Rupee (₹) format with comma grouping.
 * e.g., 1234567.5 -> ₹12,34,567.50
 */
export function formatINR(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount).toFixed(2);
  const [integerPart, decimalPart] = absAmount.split('.');

  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInteger =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return `${isNegative ? '-' : ''}₹${formattedInteger}.${decimalPart}`;
}

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other',
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food & Dining',
  'Rent & Utilities',
  'Transport',
  'Shopping',
  'Health',
  'Entertainment',
  'Bills',
  'Miscellaneous',
];

export const CURRENT_MONTH_STR = '2026-09';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    userId: 1,
    type: 'income',
    category: 'Salary',
    amount: 65000,
    paymentMethod: 'Net Banking',
    transactionDate: '2026-09-01',
    description: 'Monthly payroll credit from TechCorp',
    createdAt: '2026-09-01T09:00:00Z',
  },
  {
    id: 2,
    userId: 1,
    type: 'expense',
    category: 'Rent & Utilities',
    amount: 16000,
    paymentMethod: 'Net Banking',
    transactionDate: '2026-09-02',
    description: 'Apartment rent & maintenance fee',
    createdAt: '2026-09-02T10:30:00Z',
  },
  {
    id: 3,
    userId: 1,
    type: 'expense',
    category: 'Food & Dining',
    amount: 3200,
    paymentMethod: 'UPI',
    transactionDate: '2026-09-03',
    description: 'Weekly grocery basket at D-Mart',
    createdAt: '2026-09-03T18:45:00Z',
  },
  {
    id: 4,
    userId: 1,
    type: 'expense',
    category: 'Transport',
    amount: 1200,
    paymentMethod: 'UPI',
    transactionDate: '2026-09-04',
    description: 'Monthly Metro smart card recharge',
    createdAt: '2026-09-04T08:15:00Z',
  },
  {
    id: 5,
    userId: 1,
    type: 'expense',
    category: 'Food & Dining',
    amount: 2800,
    paymentMethod: 'Debit Card',
    transactionDate: '2026-09-06',
    description: 'Weekend dinner with team',
    createdAt: '2026-09-06T21:10:00Z',
  },
  {
    id: 6,
    userId: 1,
    type: 'income',
    category: 'Freelance',
    amount: 15000,
    paymentMethod: 'UPI',
    transactionDate: '2026-09-10',
    description: 'UI/UX Mobile redesign milestone payout',
    createdAt: '2026-09-10T14:20:00Z',
  },
  {
    id: 7,
    userId: 1,
    type: 'expense',
    category: 'Shopping',
    amount: 6500,
    paymentMethod: 'Credit Card',
    transactionDate: '2026-09-12',
    description: 'Ergonomic office chair & desk lamp',
    createdAt: '2026-09-12T16:00:00Z',
  },
  {
    id: 8,
    userId: 1,
    type: 'expense',
    category: 'Transport',
    amount: 2000,
    paymentMethod: 'UPI',
    transactionDate: '2026-09-15',
    description: 'Vehicle petrol top-up',
    createdAt: '2026-09-15T11:30:00Z',
  },
  {
    id: 9,
    userId: 1,
    type: 'expense',
    category: 'Entertainment',
    amount: 4500,
    paymentMethod: 'Debit Card',
    transactionDate: '2026-09-18',
    description: 'Weekend concert tickets & refreshments',
    createdAt: '2026-09-18T19:00:00Z',
  },
  {
    id: 10,
    userId: 1,
    type: 'expense',
    category: 'Food & Dining',
    amount: 3800,
    paymentMethod: 'UPI',
    transactionDate: '2026-09-21',
    description: 'Restocking essentials and organic pantry',
    createdAt: '2026-09-21T13:40:00Z',
  },
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 1,
    userId: 1,
    category: 'Overall',
    monthYear: CURRENT_MONTH_STR,
    allocatedAmount: 45000,
  },
  {
    id: 2,
    userId: 1,
    category: 'Rent & Utilities',
    monthYear: CURRENT_MONTH_STR,
    allocatedAmount: 18000,
  },
  {
    id: 3,
    userId: 1,
    category: 'Food & Dining',
    monthYear: CURRENT_MONTH_STR,
    allocatedAmount: 12000,
  },
  {
    id: 4,
    userId: 1,
    category: 'Shopping',
    monthYear: CURRENT_MONTH_STR,
    allocatedAmount: 8000,
  },
  {
    id: 5,
    userId: 1,
    category: 'Transport',
    monthYear: CURRENT_MONTH_STR,
    allocatedAmount: 4000,
  },
  {
    id: 6,
    userId: 1,
    category: 'Entertainment',
    monthYear: CURRENT_MONTH_STR,
    allocatedAmount: 4000,
  },
];

export const INITIAL_GOALS: SavingsGoal[] = [
  {
    id: 1,
    userId: 1,
    goalName: 'Emergency Rainy-Day Fund',
    targetAmount: 50000,
    currentAmount: 25000,
    targetDate: '2026-12-31',
    status: 'in_progress',
    createdAt: '2026-08-01',
  },
  {
    id: 2,
    userId: 1,
    goalName: 'Developer Workstation Upgrade',
    targetAmount: 85000,
    currentAmount: 48000,
    targetDate: '2026-11-15',
    status: 'in_progress',
    createdAt: '2026-07-15',
  },
  {
    id: 3,
    userId: 1,
    goalName: 'Annual Insurance Premium',
    targetAmount: 18000,
    currentAmount: 18000,
    targetDate: '2026-09-30',
    status: 'completed',
    createdAt: '2026-06-01',
  },
];

/**
 * Calculates current month dashboard KPIs based on transactions and budgets.
 */
export function computeDashboardMetrics(
  transactions: Transaction[],
  budgets: Budget[],
  monthYear: string = CURRENT_MONTH_STR
): DashboardMetrics {
  let totalBalance = 0;
  let totalMonthlyIncome = 0;
  let totalMonthlyExpenses = 0;

  for (const t of transactions) {
    if (t.type === 'income') {
      totalBalance += t.amount;
      if (t.transactionDate.startsWith(monthYear)) {
        totalMonthlyIncome += t.amount;
      }
    } else {
      totalBalance -= t.amount;
      if (t.transactionDate.startsWith(monthYear)) {
        totalMonthlyExpenses += t.amount;
      }
    }
  }

  const overallBudgetObj = budgets.find(
    (b) => b.category === 'Overall' && b.monthYear === monthYear
  );
  const overallBudget = overallBudgetObj ? overallBudgetObj.allocatedAmount : 45000;
  const overallBudgetSpent = totalMonthlyExpenses;
  const overallBudgetPercentage =
    overallBudget > 0 ? (overallBudgetSpent / overallBudget) * 100 : 0;

  let overallBudgetStatus: DashboardMetrics['overallBudgetStatus'] = 'on_track';
  if (overallBudgetPercentage >= 100) {
    overallBudgetStatus = 'exceeded';
  } else if (overallBudgetPercentage >= 75) {
    overallBudgetStatus = 'warning';
  }

  return {
    totalBalance,
    totalMonthlyIncome,
    totalMonthlyExpenses,
    netSavings: totalMonthlyIncome - totalMonthlyExpenses,
    overallBudget,
    overallBudgetSpent,
    overallBudgetPercentage,
    overallBudgetStatus,
  };
}

/**
 * Calculates category-wise budget progress and statuses.
 */
export function computeCategoryBudgets(
  transactions: Transaction[],
  budgets: Budget[],
  monthYear: string = CURRENT_MONTH_STR
): BudgetWithSpending[] {
  // Aggregate expenses for the given month
  const categorySpendingMap = new Map<string, number>();

  for (const t of transactions) {
    if (t.type === 'expense' && t.transactionDate.startsWith(monthYear)) {
      const current = categorySpendingMap.get(t.category) || 0;
      categorySpendingMap.set(t.category, current + t.amount);
    }
  }

  return budgets.map((b) => {
    const spentAmount =
      b.category === 'Overall'
        ? Array.from(categorySpendingMap.values()).reduce((sum, v) => sum + v, 0)
        : categorySpendingMap.get(b.category) || 0;

    const percentageUsed =
      b.allocatedAmount > 0 ? (spentAmount / b.allocatedAmount) * 100 : 0;

    let status: BudgetWithSpending['status'] = 'on_track';
    if (percentageUsed >= 100) {
      status = 'exceeded';
    } else if (percentageUsed >= 75) {
      status = 'warning';
    }

    return {
      ...b,
      spentAmount,
      percentageUsed,
      remainingAmount: b.allocatedAmount - spentAmount,
      status,
    };
  });
}

/**
 * Deterministic rules-based smart spending insights generator.
 */
export function generateSmartInsights(
  transactions: Transaction[],
  budgets: Budget[],
  monthYear: string = CURRENT_MONTH_STR
): SmartInsight[] {
  const insights: SmartInsight[] = [];

  // Zero-state onboarding insight
  if (transactions.length === 0) {
    return [
      {
        id: 'zero-state-welcome',
        type: 'tip',
        title: 'Zero Balance Ledger (₹0.00)',
        description:
          'Your income and expenses start at ₹0.00. Click "+ Add All Workshop Records" to populate sample data or record entries to see budget calculations live.',
        metric: 'Net Balance: ₹0.00',
      },
    ];
  }

  const monthlyExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.transactionDate.startsWith(monthYear)
  );
  const totalExpense = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);

  // Group by category
  const catExpenses: Record<string, number> = {};
  for (const exp of monthlyExpenses) {
    catExpenses[exp.category] = (catExpenses[exp.category] || 0) + exp.amount;
  }

  // Rule 1: Category Dominance (>35% of total expenses)
  if (totalExpense > 0) {
    for (const [cat, amt] of Object.entries(catExpenses)) {
      const pct = (amt / totalExpense) * 100;
      if (pct > 35) {
        insights.push({
          id: `dominance-${cat}`,
          type: 'warning',
          title: 'High Category Concentration',
          description: `${cat} represents ${pct.toFixed(1)}% (${formatINR(amt)}) of your total spending this month. Consider checking for optimization opportunities.`,
          metric: `${pct.toFixed(0)}% of total expenses`,
          category: cat,
        });
      }
    }
  }

  // Rule 2: Category Budget Exceeded
  const categoryBudgets = computeCategoryBudgets(transactions, budgets, monthYear);
  for (const b of categoryBudgets) {
    if (b.category !== 'Overall' && b.status === 'exceeded') {
      const overBy = b.spentAmount - b.allocatedAmount;
      insights.push({
        id: `over-budget-${b.category}`,
        type: 'alert',
        title: `${b.category} Budget Exceeded`,
        description: `You have spent ${formatINR(b.spentAmount)} against an allocated limit of ${formatINR(b.allocatedAmount)} (exceeded by ${formatINR(overBy)}).`,
        metric: `${b.percentageUsed.toFixed(0)}% allocated`,
        category: b.category,
      });
    } else if (b.category !== 'Overall' && b.status === 'warning') {
      insights.push({
        id: `warning-budget-${b.category}`,
        type: 'warning',
        title: `${b.category} Approaching Cap`,
        description: `You have utilized ${b.percentageUsed.toFixed(1)}% of your ${b.category} budget. ${formatINR(b.remainingAmount)} remaining.`,
        metric: `${b.percentageUsed.toFixed(0)}% used`,
        category: b.category,
      });
    }
  }

  // Rule 3: Net Cash Flow Surplus
  const monthlyIncomes = transactions.filter(
    (t) => t.type === 'income' && t.transactionDate.startsWith(monthYear)
  );
  const totalIncome = monthlyIncomes.reduce((sum, t) => sum + t.amount, 0);

  if (totalIncome > totalExpense && totalExpense > 0) {
    const savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;
    insights.push({
      id: 'healthy-surplus',
      type: 'positive',
      title: 'Positive Net Savings Pace',
      description: `You are saving ${savingsRate.toFixed(1)}% (${formatINR(totalIncome - totalExpense)}) of your monthly earnings so far this period. Great job!`,
      metric: `${savingsRate.toFixed(0)}% savings rate`,
    });
  }

  return insights;
}
