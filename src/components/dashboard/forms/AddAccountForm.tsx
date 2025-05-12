import React, { useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import {
  addAccount,
  fetchAccounts, // Импортируем fetchAccounts
} from "../../../store/slices/dashboardSlice";
import Button from "../../ui/Button";
import InputField from "../../ui/InputField";

interface AddAccountFormProps {
  onClose: () => void;
}

const AddAccountForm: React.FC<AddAccountFormProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    balance: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", balance: "" };

    if (!name.trim()) {
      newErrors.name = "Название обязательно";
      isValid = false;
    }

    const balanceValue = parseFloat(initialBalance);
    if (isNaN(balanceValue)) {
      newErrors.balance = "Введите число";
      isValid = false;
    } else if (balanceValue < 0) {
      newErrors.balance = "Баланс не может быть отрицательным";
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
      const balanceValue = parseFloat(initialBalance) || 0;
      await dispatch(
        addAccount({
          name: name.trim(),
          initialBalance: balanceValue,
        })
      ).unwrap();

      // После успешного добавления обновляем список счетов
      await dispatch(fetchAccounts());

      onClose();
    } catch (error: any) {
      console.error("Ошибка при добавлении счета:", error);
      // Здесь можно добавить логику отображения ошибки пользователю
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
      setInitialBalance(value);
      if (formErrors.balance) {
        setFormErrors({ ...formErrors, balance: "" });
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (formErrors.name) {
      setFormErrors({ ...formErrors, name: "" });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Добавить счет</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Название счета"
          id="account-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          errorMessage={formErrors.name}
          disabled={isSubmitting}
          required
        />

        <InputField
          label="Начальный баланс"
          id="account-balance"
          type="text"
          inputMode="decimal"
          value={initialBalance}
          onChange={handleBalanceChange}
          errorMessage={formErrors.balance}
          disabled={isSubmitting}
          placeholder="0.00"
          required
        />

        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
            type="button"
          >
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Добавление..." : "Добавить"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAccountForm;
