import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  Transaction,
  IncomeSource,
  Account,
  ExpenseCategory,
} from "../../types"; // Create a types.ts file for your interfaces
import * as dashboardApi from "../../api/dashboard/dashboardApi";

interface DashboardState {
  transactions: Transaction[];
  incomeSources: IncomeSource[];
  accounts: Account[];
  expenseCategories: ExpenseCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  transactions: [],
  incomeSources: [],
  accounts: [],
  expenseCategories: [],
  loading: false,
  error: null,
};

// Async Thunks for Transactions
export const fetchTransactions = createAsyncThunk(
  "dashboard/fetchTransactions",
  async () => {
    return await dashboardApi.fetchTransactions();
  }
);

export const addTransaction = createAsyncThunk(
  "dashboard/addTransaction",
  async (transaction: Omit<Transaction, "id">) => {
    return await dashboardApi.postTransaction(transaction);
  }
);

export const updateTransaction = createAsyncThunk(
  "dashboard/updateTransaction",
  async (transaction: Transaction) => {
    return await dashboardApi.putTransaction(transaction);
  }
);

export const deleteTransaction = createAsyncThunk(
  "dashboard/deleteTransaction",
  async (id: string) => {
    await dashboardApi.deleteTransactionApi(id);
    return id; // Return the id to update the state
  }
);

// Async Thunks for Income Sources
export const fetchIncomeSources = createAsyncThunk(
  "dashboard/fetchIncomeSources",
  async () => {
    return await dashboardApi.fetchIncomeSources();
  }
);

export const addIncomeSource = createAsyncThunk(
  "dashboard/addIncomeSource",
  async (incomeSource: Omit<IncomeSource, "id">) => {
    return await dashboardApi.postIncomeSource(incomeSource);
  }
);

export const updateIncomeSource = createAsyncThunk(
  "dashboard/updateIncomeSource",
  async (incomeSource: IncomeSource) => {
    return await dashboardApi.putIncomeSource(incomeSource);
  }
);

export const removeIncomeSource = createAsyncThunk(
  "dashboard/removeIncomeSource",
  async (id: string) => {
    await dashboardApi.deleteIncomeSourceApi(id);
    return id; // Return the id to update the state
  }
);

// Async Thunks for Accounts
export const fetchAccounts = createAsyncThunk(
  "dashboard/fetchAccounts",
  async () => {
    return await dashboardApi.fetchAccounts();
  }
);

export const addAccount = createAsyncThunk(
  "dashboard/addAccount",
  async (account: Omit<Account, "id">) => {
    return await dashboardApi.postAccount(account);
  }
);

export const updateAccount = createAsyncThunk(
  "dashboard/updateAccount",
  async (account: Account) => {
    return await dashboardApi.putAccount(account);
  }
);

export const removeAccount = createAsyncThunk(
  "dashboard/removeAccount",
  async (id: string) => {
    await dashboardApi.deleteAccountApi(id);
    return id; // Return the id to update the state
  }
);

// Async Thunks for Expense Categories
export const fetchExpenseCategories = createAsyncThunk(
  "dashboard/fetchExpenseCategories",
  async () => {
    return await dashboardApi.fetchExpenseCategories();
  }
);

export const addExpenseCategory = createAsyncThunk(
  "dashboard/addExpenseCategory",
  async (expenseCategory: Omit<ExpenseCategory, "id">) => {
    return await dashboardApi.postExpenseCategory(expenseCategory);
  }
);

export const updateExpenseCategory = createAsyncThunk(
  "dashboard/updateExpenseCategory",
  async (expenseCategory: ExpenseCategory) => {
    return await dashboardApi.putExpenseCategory(expenseCategory);
  }
);

export const removeExpenseCategory = createAsyncThunk(
  "dashboard/removeExpenseCategory",
  async (id: string) => {
    await dashboardApi.deleteExpenseCategoryApi(id);
    return id; // Return the id to update the state
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {}, // We will handle state updates in extraReducers
  extraReducers: (builder) => {
    // Transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch transactions";
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (t) => t.id !== action.payload
        );
      });

    // Income Sources
    builder
      .addCase(fetchIncomeSources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomeSources.fulfilled, (state, action) => {
        state.loading = false;
        state.incomeSources = action.payload;
      })
      .addCase(fetchIncomeSources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch income sources";
      })
      .addCase(addIncomeSource.fulfilled, (state, action) => {
        state.incomeSources.push(action.payload);
      })
      .addCase(updateIncomeSource.fulfilled, (state, action) => {
        const index = state.incomeSources.findIndex(
          (i) => i.id === action.payload.id
        );
        if (index !== -1) {
          state.incomeSources[index] = action.payload;
        }
      })
      .addCase(removeIncomeSource.fulfilled, (state, action) => {
        state.incomeSources = state.incomeSources.filter(
          (i) => i.id !== action.payload
        );
      });

    // Accounts
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch accounts";
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload);
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex(
          (a) => a.id === action.payload.id
        );
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(removeAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter((a) => a.id !== action.payload);
      });

    // Expense Categories
    builder
      .addCase(fetchExpenseCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseCategories = action.payload;
      })
      .addCase(fetchExpenseCategories.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch expense categories";
      })
      .addCase(addExpenseCategory.fulfilled, (state, action) => {
        state.expenseCategories.push(action.payload);
      })
      .addCase(updateExpenseCategory.fulfilled, (state, action) => {
        const index = state.expenseCategories.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.expenseCategories[index] = action.payload;
        }
      })
      .addCase(removeExpenseCategory.fulfilled, (state, action) => {
        state.expenseCategories = state.expenseCategories.filter(
          (e) => e.id !== action.payload
        );
      });
  },
});

export const {} = dashboardSlice.actions; // We don't have direct reducers anymore

export default dashboardSlice.reducer;
