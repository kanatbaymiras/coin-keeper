import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addTransaction } from "../../store/slices/dashboardSlice";
import { type Transaction } from "../../types";
import InputField from "../ui/InputField";
import Button from "../ui/Button";

interface TransactionFormProps {
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { incomeSources, accounts, expenseCategories } = useAppSelector(
    (state) => state.dashboard
  );

  const [formData, setFormData] = useState<Omit<Transaction, "id">>({
    from: "",
    to: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
  });
  const [formErrors, setFormErrors] = useState({
    from: "",
    to: "",
    amount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, amount: parseFloat(value) || 0 }));
      if (formErrors.amount) {
        setFormErrors((prev) => ({ ...prev, amount: "" }));
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { from: "", to: "", amount: "" };

    if (!formData.from) {
      newErrors.from = "Выберите источник";
      isValid = false;
    }
    if (!formData.to) {
      newErrors.to = "Выберите назначение";
      isValid = false;
    }
    if (formData.amount <= 0) {
      newErrors.amount = "Сумма должна быть положительной";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await dispatch(addTransaction(formData)).unwrap();
      onClose();
    } catch (error: any) {
      console.error("Ошибка при добавлении транзакции:", error);
      // Здесь можно добавить логику отображения ошибки пользователю
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Создать транзакцию</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Откуда
          </label>
          <select
            name="from"
            className={`w-full p-2 border ${
              formErrors.from ? "border-red-500" : "border-gray-300"
            } rounded-md focus:ring-blue-500 focus:border-blue-500`}
            value={formData.from}
            onChange={handleInputChange}
            disabled={isSubmitting}
          >
            <option value="">Выберите источник</option>
            <optgroup label="Доходы">
              {incomeSources.map((source) => (
                <option
                  key={`income-${source.id}`}
                  value={`income-${source.name}`}
                >
                  {source.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Счета">
              {accounts.map((account) => (
                <option
                  key={`account-from-${account.id}`}
                  value={`account-${account.name}`}
                >
                  {account.name}
                </option>
              ))}
            </optgroup>
          </select>
          {formErrors.from && (
            <p className="mt-1 text-sm text-red-500">{formErrors.from}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Куда
          </label>
          <select
            name="to"
            className={`w-full p-2 border ${
              formErrors.to ? "border-red-500" : "border-gray-300"
            } rounded-md focus:ring-blue-500 focus:border-blue-500`}
            value={formData.to}
            onChange={handleInputChange}
            disabled={isSubmitting}
          >
            <option value="">Выберите назначение</option>
            <optgroup label="Счета">
              {accounts.map((account) => (
                <option
                  key={`account-to-${account.id}`}
                  value={`account-${account.name}`}
                >
                  {account.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Расходы">
              {expenseCategories.map((category) => (
                <option
                  key={`expense-${category.id}`}
                  value={`expense-${category.name}`}
                >
                  {category.name}
                </option>
              ))}
            </optgroup>
          </select>
          {formErrors.to && (
            <p className="mt-1 text-sm text-red-500">{formErrors.to}</p>
          )}
        </div>

        <InputField
          label="Сумма"
          name="amount"
          type="text"
          inputMode="decimal"
          value={formData.amount.toString()}
          onChange={handleAmountChange}
          errorMessage={formErrors.amount}
          disabled={isSubmitting}
          required
        />

        <InputField
          label="Дата"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleInputChange}
          disabled={isSubmitting}
          required
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
            type="button"
          >
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Создание..." : "Создать транзакцию"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
