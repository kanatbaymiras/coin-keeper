import React, { useState } from "react";
import IncomeWidget from "../components/dashboard/IncomeWidget";
import AccountsWidget from "../components/dashboard/AccountsWidget";
import ExpensesWidget from "../components/dashboard/ExpensesWidget";
import TransactionsHistoryWidget from "../components/dashboard/TransactionsHistoryWidget";
import Header from "../components/layout/Header";
import TransactionForm from "../components/dashboard/TransactionForm";
import Modal from "../components/ui/Modal";
import AddIncomeSourceForm from "../components/dashboard/forms/AddIncomeSourceForm"; // Создайте этот компонент
import AddAccountForm from "../components/dashboard/forms/AddAccountForm"; // Создайте этот компонент
import AddExpenseCategoryForm from "../components/dashboard/forms/AddExpenseCategoryForm"; // Создайте этот компонент

const Dashboard: React.FC = () => {
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [isAddIncomeFormOpen, setIsAddIncomeFormOpen] = useState(false);
  const [isAddAccountFormOpen, setIsAddAccountFormOpen] = useState(false);
  const [isAddExpenseFormOpen, setIsAddExpenseFormOpen] = useState(false);

  const openTransactionForm = () => setIsTransactionFormOpen(true);
  const closeTransactionForm = () => setIsTransactionFormOpen(false);

  const openAddIncomeForm = () => setIsAddIncomeFormOpen(true);
  const closeAddIncomeForm = () => setIsAddIncomeFormOpen(false);

  const openAddAccountForm = () => setIsAddAccountFormOpen(true);
  const closeAddAccountForm = () => setIsAddAccountFormOpen(false);

  const openAddExpenseForm = () => setIsAddExpenseFormOpen(true);
  const closeAddExpenseForm = () => setIsAddExpenseFormOpen(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8">
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Левая колонка */}
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={openTransactionForm}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
            <IncomeWidget onAddClick={openAddIncomeForm} />{" "}
            {/* Передаем обработчик открытия */}
            <AccountsWidget onAddClick={openAddAccountForm} />{" "}
            {/* Передаем обработчик открытия */}
            <ExpensesWidget onAddClick={openAddExpenseForm} />{" "}
            {/* Передаем обработчик открытия */}
          </div>

          {/* Правая колонка */}
          <div className="md:col-span-2 lg:col-span-2 space-y-6">
            <TransactionsHistoryWidget />
          </div>

          {/* Модальные окна */}
          {isTransactionFormOpen && (
            <Modal
              isOpen={isTransactionFormOpen}
              onClose={closeTransactionForm}
            >
              <TransactionForm onClose={closeTransactionForm} />
            </Modal>
          )}

          {isAddIncomeFormOpen && (
            <Modal isOpen={isAddIncomeFormOpen} onClose={closeAddIncomeForm}>
              <AddIncomeSourceForm onClose={closeAddIncomeForm} />{" "}
              {/* Создайте этот компонент */}
            </Modal>
          )}

          {isAddAccountFormOpen && (
            <Modal isOpen={isAddAccountFormOpen} onClose={closeAddAccountForm}>
              <AddAccountForm onClose={closeAddAccountForm} />{" "}
              {/* Создайте этот компонент */}
            </Modal>
          )}

          {isAddExpenseFormOpen && (
            <Modal isOpen={isAddExpenseFormOpen} onClose={closeAddExpenseForm}>
              <AddExpenseCategoryForm onClose={closeAddExpenseForm} />{" "}
              {/* Создайте этот компонент */}
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
