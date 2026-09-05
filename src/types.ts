export type TransactionType = 'income' | 'expense';

export type IncomeCategory = 'Salary' | 'Freelance' | 'Investment' | 'Gift' | 'Other';

export type ExpenseCategory =
  | 'Food & Dining'
  | 'Rent & Utilities'
  | 'Transport'
  | 'Shopping'
  | 'Health'
  | 'Entertainment'
  | 'Bills'
  | 'Miscellaneous';

export type PaymentMethod = 'UPI' | 'Cash' | 'Debit Card' | 'Credit Card' | 'Net Banking';

export interface Transaction {
  id: string | number;
  userId: string | number;
  type: TransactionType;
  category: IncomeCategory | ExpenseCategory | string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionDate: string; // YYYY-MM-DD
  description: string;
  createdAt: string;
}

export type BudgetStatus = 'on_track' | 'warning' | 'exceeded';

export interface Budget {
  id: string | number;
  userId: string | number;
  category: string; // 'Overall' for the total monthly cap or specific category
  monthYear: string; // YYYY-MM
  allocatedAmount: number;
}

export interface BudgetWithSpending extends Budget {
  spentAmount: number;
  percentageUsed: number;
  remainingAmount: number;
  status: BudgetStatus;
}

export type GoalStatus = 'in_progress' | 'completed' | 'overdue';

export interface SavingsGoal {
  id: string | number;
  userId: string | number;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  status: GoalStatus;
  createdAt: string;
}

export interface SmartInsight {
  id: string;
  type: 'alert' | 'warning' | 'tip' | 'positive';
  title: string;
  description: string;
  metric?: string;
  category?: string;
}

export interface DashboardMetrics {
  totalBalance: number;
  totalMonthlyIncome: number;
  totalMonthlyExpenses: number;
  netSavings: number;
  overallBudget: number;
  overallBudgetSpent: number;
  overallBudgetPercentage: number;
  overallBudgetStatus: BudgetStatus;
}

export interface FilterState {
  type: 'all' | 'income' | 'expense';
  category: string;
  searchQuery: string;
  monthYear: string;
}

export interface User {
  id: string | number;
  fullName: string;
  email: string;
}

export interface PaperSubmission {
  id: string;
  title: string;
  abstract: string;
  authors: string;
  category: string;
  status: 'submitted' | 'under_review' | 'accepted' | 'revision';
  fileUrl?: string;
  submittedById: string;
  submittedByName: string;
  createdAt: string;
}

export interface PaperComment {
  id: string;
  paperId: string;
  userId: string;
  userName: string;
  commentText: string;
  createdAt: string;
}

export type ActiveSection = 'dashboard' | 'budgets' | 'analysis' | 'transactions' | 'goals' | 'papers';
