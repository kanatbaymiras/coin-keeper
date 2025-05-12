import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  removeIncomeSource,
  fetchIncomeSources,
} from "../../store/slices/dashboardSlice";

interface IncomeWidgetProps {
  onAddClick: () => void;
}

const IncomeWidget: React.FC<IncomeWidgetProps> = ({ onAddClick }) => {
  const dispatch = useAppDispatch();
  const { incomeSources, transactions, loading, error } = useAppSelector(
    (state) => state.dashboard
  );

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    dispatch(fetchIncomeSources());
  }, [dispatch]);

  const totalIncome = incomeSources.reduce(
    (sum, source) => sum + source.expectedAmount,
    0
  );

  const assignedIncome = transactions.reduce((sum, transaction) => {
    const isIncomeToAccount =
      transaction.from.startsWith("income-") &&
      transaction.to.startsWith("account-");
    return isIncomeToAccount ? sum + transaction.amount : sum;
  }, 0);

  const handleRemoveIncomeSource = async (id: string) => {
    try {
      await dispatch(removeIncomeSource(id)).unwrap();
      // После успешного удаления обновляем список
      dispatch(fetchIncomeSources());
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Доходы</h3>
        <span>Всего: {totalIncome} ₸</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Получено: {Number(assignedIncome)} ₸
      </p>
      <h4 className="text-md font-semibold mb-2">Источники доходов</h4>
      <ul>
        {incomeSources.map((source) => (
          <li
            key={source.id}
            className="py-1 flex justify-between items-center"
          >
            <span>
              {source.name}: {source.expectedAmount} ₸
            </span>
            <button
              onClick={() => handleRemoveIncomeSource(source.id)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
              disabled={loading}
            >
              Удалить
            </button>
          </li>
        ))}
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

export default IncomeWidget;
