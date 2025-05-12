import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { type Transaction } from "../../types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  fetchTransactions,
  deleteTransaction,
  updateTransaction,
} from "../../store/slices/dashboardSlice";
import InputField from "../ui/InputField";

interface TransactionItemProps {
  transaction: Transaction;
  getSourceName: (sourceId: string) => string;
  getCategoryName: (categoryId: string) => string;
  onDelete: (id: string) => void;
  onUpdate: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  getSourceName,
  getCategoryName,
  onDelete,
  onUpdate,
}) => {
  const dispatch = useAppDispatch();
  const { incomeSources, accounts, expenseCategories } = useAppSelector(
    (state) => state.dashboard
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState(String(transaction.amount));
  const [editedFrom, setEditedFrom] = useState(transaction.from);
  const [editedTo, setEditedTo] = useState(transaction.to);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allSources = [
    ...incomeSources.map((s) => ({
      id: `income-${s.name}`,
      name: s.name,
      type: "income",
    })),
    ...accounts.map((a) => ({
      id: `account-${a.name}`,
      name: a.name,
      type: "account",
    })),
  ];
  const allDestinations = [
    ...accounts.map((a) => ({
      id: `account-${a.name}`,
      name: a.name,
      type: "account",
    })),
    ...expenseCategories.map((e) => ({
      id: `expense-${e.name}`,
      name: e.name,
      type: "expense",
    })),
  ];

  const handleEditClick = () => {
    setIsEditing(true);
    setErrorMessage(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedAmount(String(transaction.amount));
    setEditedFrom(transaction.from);
    setEditedTo(transaction.to);
    setErrorMessage(null);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
      setEditedAmount(value);
    }
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedFrom(e.target.value);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedTo(e.target.value);
  };

  const handleSaveClick = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const amount = parseFloat(editedAmount);
      if (isNaN(amount)) {
        setErrorMessage("Пожалуйста, введите корректную сумму.");
        setIsSubmitting(false);
        return;
      }

      if (editedFrom === editedTo) {
        setErrorMessage(
          "Нельзя совершать транзакцию из одного и того же источника/получателя."
        );
        setIsSubmitting(false);
        return;
      }

      const isIncomeToAccount =
        editedFrom.startsWith("income-") && editedTo.startsWith("account-");
      const isExpenseFromAccount =
        editedFrom.startsWith("account-") && editedTo.startsWith("expense-");
      const isTransferBetweenAccounts =
        editedFrom.startsWith("account-") && editedTo.startsWith("account-");

      if (
        !isIncomeToAccount &&
        !isExpenseFromAccount &&
        !isTransferBetweenAccounts
      ) {
        setErrorMessage(
          "Транзакция может быть только из дохода на счет, со счета на расход или между счетами."
        );
        setIsSubmitting(false);
        return;
      }

      // Дополнительная проверка для предотвращения перевода между одним и тем же счетом
      if (isTransferBetweenAccounts && editedFrom === editedTo) {
        setErrorMessage(
          "Нельзя переводить деньги с одного и того же счета на него же."
        );
        setIsSubmitting(false);
        return;
      }

      const updatedTransaction: Transaction = {
        ...transaction,
        amount,
        from: editedFrom,
        to: editedTo,
      };

      await dispatch(updateTransaction(updatedTransaction)).unwrap();
      onUpdate(updatedTransaction); // Notify parent component
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при обновлении транзакции:", error);
      setErrorMessage("Произошла ошибка при обновлении транзакции.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteClick = async () => {
    if (window.confirm("Вы уверены, что хотите удалить эту транзакцию?")) {
      setIsSubmitting(true);
      try {
        await dispatch(deleteTransaction(transaction.id)).unwrap();
        onDelete(transaction.id); // Notify parent component
      } catch (error) {
        console.error("Ошибка при удалении транзакции:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <li className="flex justify-between items-center py-2">
      <div>
        <p className="text-sm font-semibold text-gray-700">
          {getSourceName(transaction.from)}
        </p>
        <p className="text-xs text-gray-500">
          {transaction.to.startsWith("account-")
            ? `-> ${getSourceName(transaction.to)}`
            : `-> ${getCategoryName(transaction.to)}`}
        </p>
      </div>
      {isEditing ? (
        <div className="flex flex-col items-end space-y-1">
          <div className="flex items-center space-x-2">
            <select
              value={editedFrom}
              onChange={handleFromChange}
              className="border rounded py-1 px-2 text-sm"
            >
              <option value="">Выберите источник</option>
              {allSources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </select>
            <select
              value={editedTo}
              onChange={handleToChange}
              className="border rounded py-1 px-2 text-sm"
            >
              <option value="">Выберите получателя</option>
              {allDestinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name}
                </option>
              ))}
            </select>
            <InputField
              type="text"
              value={editedAmount}
              onChange={handleAmountChange}
              className="w-24 text-right"
            />
            <button
              onClick={handleSaveClick}
              disabled={isSubmitting}
              className="text-green-500 hover:text-green-700 focus:outline-none"
            >
              Сохранить
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              Отмена
            </button>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-xs">{errorMessage}</p>
          )}
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <p
            className={`text-sm font-semibold ${
              transaction.to.startsWith("account-") &&
              transaction.from.startsWith("income-")
                ? "text-green-500"
                : transaction.from.startsWith("account-") &&
                  transaction.to.startsWith("expense-")
                ? "text-red-500"
                : "text-gray-800"
            }`}
          >
            {transaction.to.startsWith("account-") &&
            transaction.from.startsWith("income-")
              ? "+"
              : transaction.from.startsWith("account-") &&
                transaction.to.startsWith("expense-")
              ? "-"
              : ""}
            {transaction.amount} ₸
          </p>
          <button
            onClick={handleEditClick}
            disabled={isSubmitting}
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            Редактировать
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={isSubmitting}
            className="text-red-500 hover:text-red-700 focus:outline-none"
          >
            Удалить
          </button>
        </div>
      )}
    </li>
  );
};

interface DateHeaderProps {
  date: Date;
}

const DateHeader: React.FC<DateHeaderProps> = ({ date }) => {
  return (
    <h3 className="text-md font-semibold text-gray-800 mb-2 mt-4">
      {format(date, "EEEE, d MMMM", { locale: ru })}
    </h3>
  );
};

const TransactionsHistoryWidget: React.FC = () => {
  const {
    transactions,
    incomeSources,
    accounts,
    expenseCategories,
    loading,
    error,
  } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();

  const [totalBalanceChange, setTotalBalanceChange] = useState(0);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const getSourceName = (sourceId: string) => {
    if (sourceId.startsWith("income-")) {
      const name = sourceId.substring("income-".length);
      return incomeSources.find((s) => s.name === name)?.name || name;
    }
    if (sourceId.startsWith("account-")) {
      const name = sourceId.substring("account-".length);
      return accounts.find((a) => a.name === name)?.name || name;
    }
    return sourceId;
  };

  const getCategoryName = (categoryId: string) => {
    if (categoryId.startsWith("expense-")) {
      const name = categoryId.substring("expense-".length);
      return expenseCategories.find((e) => e.name === name)?.name || name;
    }
    if (categoryId.startsWith("account-")) {
      const name = categoryId.substring("account-".length);
      return accounts.find((a) => a.name === name)?.name || name;
    }
    return categoryId;
  };

  const calculateBalanceChange = (transactions: Transaction[]) => {
    let total = 0;
    transactions.forEach((transaction) => {
      const isIncome =
        transaction.to.startsWith("account-") &&
        transaction.from.startsWith("income-");
      const isExpense =
        transaction.from.startsWith("account-") &&
        transaction.to.startsWith("expense-");
      const isTransfer =
        transaction.from.startsWith("account-") &&
        transaction.to.startsWith("account-");

      if (isIncome || isTransfer) {
        total += transaction.amount;
      } else if (isExpense) {
        total -= transaction.amount;
      }
    });
    return total;
  };

  useEffect(() => {
    setTotalBalanceChange(calculateBalanceChange(transactions));
  }, [transactions]);

  const balanceChangeColorClass =
    totalBalanceChange > 0
      ? "text-green-500"
      : totalBalanceChange < 0
      ? "text-red-500"
      : "text-gray-800";

  // Функция для обработки удаления транзакции
  const handleDeleteTransaction = (transactionId: string) => {
    const updatedTransactions = transactions.filter(
      (t) => t.id !== transactionId
    );
    setTotalBalanceChange(calculateBalanceChange(updatedTransactions));
  };

  // Функция для обработки обновления транзакции
  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map((t) =>
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    setTotalBalanceChange(calculateBalanceChange(updatedTransactions));
  };

  useEffect(() => {
    // Recalculate totalBalanceChange whenever transactions change
    setTotalBalanceChange(calculateBalanceChange(transactions));
  }, [transactions]);

  const groupedTransactions: { [key: string]: Transaction[] } =
    transactions.reduce(
      // Fix: Added groupedTransactions
      (acc: { [key: string]: Transaction[] }, transaction) => {
        const dateKey = transaction.date;
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(transaction);
        return acc;
      },
      {}
    );

  if (loading) return <div>Загрузка истории транзакций...</div>;
  if (error) return <div>Ошибка при загрузке истории транзакций: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        История транзакций
      </h2>
      <div>
        {Object.entries(groupedTransactions).map(
          ([date, transactionsForDate]) => {
            const dateObject = new Date(date);
            return (
              <div key={date}>
                <DateHeader date={dateObject} />
                <ul className="space-y-2">
                  {transactionsForDate.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      getSourceName={getSourceName}
                      getCategoryName={getCategoryName}
                      onDelete={handleDeleteTransaction}
                      onUpdate={handleUpdateTransaction}
                    />
                  ))}
                </ul>
              </div>
            );
          }
        )}
      </div>
      <div
        className={`border-t pt-2 mt-4 font-semibold ${balanceChangeColorClass}`}
      >
        Изменение баланса: {totalBalanceChange > 0 ? "+" : ""}
        {totalBalanceChange} ₸
      </div>
    </div>
  );
};

export default TransactionsHistoryWidget;
