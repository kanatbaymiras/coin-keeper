import React, { useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import {
  addIncomeSource,
  fetchIncomeSources,
} from "../../../store/slices/dashboardSlice";
import Button from "../../ui/Button";
import InputField from "../../ui/InputField";

interface AddIncomeSourceFormProps {
  onClose: () => void;
}

const AddIncomeSourceForm: React.FC<AddIncomeSourceFormProps> = ({
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [expectedAmount, setExpectedAmount] = useState("");
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

    const amountValue = parseFloat(expectedAmount);
    if (isNaN(amountValue)) {
      newErrors.amount = "Введите число";
      isValid = false;
    } else if (amountValue <= 0) {
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
      await dispatch(
        addIncomeSource({
          name: name.trim(),
          expectedAmount: parseFloat(expectedAmount),
        })
      ).unwrap();

      // После успешного добавления обновляем список
      await dispatch(fetchIncomeSources());

      onClose();
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setExpectedAmount(value);
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
      <h2 className="text-lg font-semibold mb-4">Добавить источник дохода</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Название"
          id="income-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          errorMessage={formErrors.name}
          disabled={isSubmitting}
          required
        />

        <InputField
          label="Ожидаемая сумма"
          id="income-amount"
          type="text"
          inputMode="decimal"
          value={expectedAmount}
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

export default AddIncomeSourceForm;
