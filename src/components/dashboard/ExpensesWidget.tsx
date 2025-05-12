import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  removeExpenseCategory,
  fetchExpenseCategories, // Импортируем fetchExpenseCategories
} from "../../store/slices/dashboardSlice";

interface ExpensesWidgetProps {
  onAddClick: () => void;
}

const ExpensesWidget: React.FC<ExpensesWidgetProps> = ({ onAddClick }) => {
  const dispatch = useAppDispatch();
  const { expenseCategories, transactions, loading, error } = useAppSelector(
    (state) => state.dashboard
  );

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    dispatch(fetchExpenseCategories());
  }, [dispatch]);

  const totalBudgeted = expenseCategories.reduce(
    (sum, category) => sum + category.budgetAmount,
    0
  );

  const totalSpent = transactions.reduce((sum, transaction) => {
    return transaction.to.startsWith("expense-")
      ? sum + transaction.amount
      : sum;
  }, 0);

  const handleRemoveExpenseCategory = async (id: string) => {
    try {
      await dispatch(removeExpenseCategory(id)).unwrap();
      // После успешного удаления обновляем список категорий расходов
      dispatch(fetchExpenseCategories());
    } catch (error) {
      console.error("Ошибка при удалении категории:", error);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Расходы</h3>
        <span>Всего запланировано: {totalBudgeted} ₸</span>
      </div>
      <p className="mb-2">Всего потрачено: {totalSpent} ₸</p>
      <ul>
        {expenseCategories.map((category) => {
          const spentInCategory = transactions.reduce((sum, t) => {
            if (t.to === `expense-${category.name}`) return sum + t.amount;
            return sum;
          }, 0);
          return (
            <li
              key={category.id}
              className="py-1 flex justify-between items-center"
            >
              <span>
                {category.name}: Потрачено {spentInCategory} ₸ / Запланировано{" "}
                {category.budgetAmount} ₸
              </span>
              <button
                onClick={() => handleRemoveExpenseCategory(category.id)}
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
export default ExpensesWidget;
