export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  date: string;
}

export interface IncomeSource {
  id: string;
  name: string;
  expectedAmount: number;
}

export interface Account {
  id: string;
  name: string;
  initialBalance: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  budgetAmount: number;
}
