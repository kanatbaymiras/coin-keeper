import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { type Transaction } from "../../types";
import InputField from "../ui/InputField";
import {
  updateTransaction,
  deleteTransaction,
} from "../../store/slices/dashboardSlice";

interface TransactionItemProps {
  transaction: Transaction;
  getSourceName: (sourceId: string) => string;
  getCategoryName: (categoryId: string) => string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  getSourceName,
  getCategoryName,
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
    setErrorMessage(null); // Сбрасываем сообщение об ошибке при начале редактирования
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
        return;
      }

      if (editedFrom === editedTo) {
        setErrorMessage(
          "Нельзя совершать транзакцию из одного и того же источника/получателя."
        );
        return;
      }

      const isIncomeToAccount =
        editedFrom.startsWith("income-") && editedTo.startsWith("account-");
      const isExpenseFromAccount =
        editedFrom.startsWith("account-") && editedTo.startsWith("expense-");
      const isTransferBetweenAccounts =
        editedFrom.startsWith("account-") && editedTo.startsWith("account-"); // Добавлена проверка

      if (
        !isIncomeToAccount &&
        !isExpenseFromAccount &&
        !isTransferBetweenAccounts
      ) {
        // Обновлено условие
        setErrorMessage(
          "Транзакция может быть только из дохода на счет, со счета на расход или между счетами."
        );
        return;
      }

      await dispatch(
        updateTransaction({
          ...transaction,
          amount,
          from: editedFrom,
          to: editedTo,
        })
      ).unwrap();
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

export default TransactionItem;
