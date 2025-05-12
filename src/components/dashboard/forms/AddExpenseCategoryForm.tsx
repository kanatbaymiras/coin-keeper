import React, { useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import {
  addExpenseCategory,
  fetchExpenseCategories, // Импортируем fetchExpenseCategories
} from "../../../store/slices/dashboardSlice";
import Button from "../../ui/Button";
import InputField from "../../ui/InputField";

interface AddExpenseCategoryFormProps {
  onClose: () => void;
}

const AddExpenseCategoryForm: React.FC<AddExpenseCategoryFormProps> = ({
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    amount: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", amount: "" };

    if (!name.trim()) {
      newErrors.name = "Название обязательно";
      isValid = false;
    }

    const amountValue = parseFloat(budgetAmount);
    if (isNaN(amountValue)) {
      newErrors.amount = "Введите число";
      isValid = false;
    } else if (amountValue <= 0) {
      newErrors.amount = "Бюджет должен быть положительным";
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
      const amountValue = parseFloat(budgetAmount) || 0;
      await dispatch(
        addExpenseCategory({
          name: name.trim(),
          budgetAmount: amountValue,
        })
      ).unwrap();

      // После успешного добавления обновляем список категорий расходов
      await dispatch(fetchExpenseCategories());

      onClose();
    } catch (error: any) {
      console.error("Ошибка при добавлении категории расхода:", error);
      // Здесь можно добавить логику отображения ошибки пользователю
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setBudgetAmount(value);
      if (formErrors.amount) {
        setFormErrors({ ...formErrors, amount: "" });
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
      <h2 className="text-lg font-semibold mb-4">
        Добавить категорию расходов
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Название категории"
          id="expense-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          errorMessage={formErrors.name}
          disabled={isSubmitting}
          required
        />

        <InputField
          label="Бюджет"
          id="expense-budget"
          type="text"
          inputMode="decimal"
          value={budgetAmount}
          onChange={handleAmountChange}
          errorMessage={formErrors.amount}
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

export default AddExpenseCategoryForm;
