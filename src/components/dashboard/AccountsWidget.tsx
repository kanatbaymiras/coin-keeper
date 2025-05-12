import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  removeAccount,
  fetchAccounts, // Импортируем fetchAccounts
} from "../../store/slices/dashboardSlice";

interface AccountsWidgetProps {
  onAddClick: () => void;
}

const AccountsWidget: React.FC<AccountsWidgetProps> = ({ onAddClick }) => {
  const dispatch = useAppDispatch();
  const { accounts, transactions, loading, error } = useAppSelector(
    (state) => state.dashboard
  );

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.initialBalance,
    0
  );

  const totalSpent = transactions.reduce((sum, transaction) => {
    const isExpenseFromAccount =
      transaction.from.startsWith("account-") &&
      transaction.to.startsWith("expense-");
    return isExpenseFromAccount ? sum + transaction.amount : sum;
  }, 0);

  const handleRemoveAccount = async (id: string) => {
    try {
      await dispatch(removeAccount(id)).unwrap();
      // После успешного удаления обновляем список счетов
      dispatch(fetchAccounts());
    } catch (error) {
      console.error("Ошибка при удалении счета:", error);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Счета</h3>
        <span>Всего: {totalBalance} ₸</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">Потрачено: {totalSpent} ₸</p>
      <ul>
        {accounts.map((account) => {
          const currentBalance =
            account.initialBalance -
            transactions.reduce((sum, t) => {
              if (t.from === `account-${account.name}`) return sum + t.amount;
              if (t.to === `account-${account.name}`) return sum + t.amount;
              return sum;
            }, 0);
          return (
            <li
              key={account.id}
              className="py-1 flex justify-between items-center"
            >
              <div>
                <span>{account.name}</span>
                <div className="text-sm text-gray-500">{currentBalance} ₸</div>
              </div>
              <button
                onClick={() => handleRemoveAccount(account.id)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
                disabled={loading}
              >
                Удалить
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex justify-center">
        <button
          onClick={onAddClick}
          className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50"
          disabled={loading}
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
    </div>
  );
};

export default AccountsWidget;
