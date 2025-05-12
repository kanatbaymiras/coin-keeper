import axios from "axios";
import type {
  Transaction,
  IncomeSource,
  Account,
  ExpenseCategory,
} from "../../types";

const API_BASE_URL = "http://localhost:3000";

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Helper function for error handling
const handleApiError = (error: any) => {
  console.error("API Error:", error);
  throw error;
};

// Transactions
export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await client.get("/transactions");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const postTransaction = async (
  transaction: Omit<Transaction, "id">
): Promise<Transaction> => {
  try {
    const response = await client.post("/transactions", transaction);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const putTransaction = async (
  transaction: Transaction
): Promise<Transaction> => {
  try {
    const response = await client.put(
      `/transactions/${transaction.id}`,
      transaction
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteTransactionApi = async (id: string): Promise<void> => {
  try {
    await client.delete(`/transactions/${id}`);
  } catch (error) {
    return handleApiError(error);
  }
};

// Income Sources
export const fetchIncomeSources = async (): Promise<IncomeSource[]> => {
  try {
    const response = await client.get("/incomeSources");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const postIncomeSource = async (
  incomeSource: Omit<IncomeSource, "id">
): Promise<IncomeSource> => {
  try {
    const response = await client.post("/incomeSources", incomeSource);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const putIncomeSource = async (
  incomeSource: IncomeSource
): Promise<IncomeSource> => {
  try {
    const response = await client.put(
      `/incomeSources/${incomeSource.id}`,
      incomeSource
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteIncomeSourceApi = async (id: string): Promise<void> => {
  try {
    await client.delete(`/incomeSources/${id}`);
  } catch (error) {
    return handleApiError(error);
  }
};

// Accounts
export const fetchAccounts = async (): Promise<Account[]> => {
  try {
    const response = await client.get("/accounts");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const postAccount = async (
  account: Omit<Account, "id">
): Promise<Account> => {
  try {
    const response = await client.post("/accounts", account);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const putAccount = async (account: Account): Promise<Account> => {
  try {
    const response = await client.put(`/accounts/${account.id}`, account);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteAccountApi = async (id: string): Promise<void> => {
  try {
    await client.delete(`/accounts/${id}`);
  } catch (error) {
    return handleApiError(error);
  }
};

// Expense Categories
export const fetchExpenseCategories = async (): Promise<ExpenseCategory[]> => {
  try {
    const response = await client.get("/expenseCategories");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const postExpenseCategory = async (
  expenseCategory: Omit<ExpenseCategory, "id">
): Promise<ExpenseCategory> => {
  try {
    const response = await client.post("/expenseCategories", expenseCategory);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const putExpenseCategory = async (
  expenseCategory: ExpenseCategory
): Promise<ExpenseCategory> => {
  try {
    const response = await client.put(
      `/expenseCategories/${expenseCategory.id}`,
      expenseCategory
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteExpenseCategoryApi = async (id: string): Promise<void> => {
  try {
    await client.delete(`/expenseCategories/${id}`);
  } catch (error) {
    return handleApiError(error);
  }
};
