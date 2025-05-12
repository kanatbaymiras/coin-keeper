import { useState } from "react";
// Используем recharts вместо @mui/x-charts
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// Убираем зависимость от MUI DatePicker, используем простой input
// Если в будущем потребуется датапикер, можно будет добавить совместимую библиотеку
import { useAppSelector } from "../store/hooks";
import dayjs from "dayjs";
import type { Transaction } from "../types";

const StatisticsPage = () => {
  const { transactions } = useAppSelector((state) => state.dashboard);
  const [startDate, setStartDate] = useState<string>(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState<string>(
    dayjs().endOf("month").format("YYYY-MM-DD")
  );

  // Фильтруем транзакции по дате
  const filteredTransactions = transactions.filter((t) => {
    const date = dayjs(t.date);
    return date.isAfter(dayjs(startDate)) && date.isBefore(dayjs(endDate));
  });

  // Группируем по отправителям (from) для доходов
  const incomeBySource = filteredTransactions
    .filter((t: Transaction) => t.to === "my_account") // Предполагаем, что доходы - это поступления на "my_account"
    .reduce((acc, t) => {
      acc[t.from] = (acc[t.from] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // Группируем по получателям (to) для расходов
  const expenseByDestination = filteredTransactions
    .filter((t: Transaction) => t.from === "my_account") // Предполагаем, что расходы - это списания с "my_account"
    .reduce((acc, t) => {
      acc[t.to] = (acc[t.to] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Статистика</h1>

      <div className="flex gap-4 mb-6">
        <div>
          <label className="block mb-1">Начальная дата</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Конечная дата</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Доходы по источникам</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(incomeBySource).map(
                    ([source, amount]) => ({
                      name: source,
                      value: amount,
                    })
                  )}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Расходы по получателям</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(expenseByDestination).map(
                  ([dest, amount]) => ({
                    name: dest,
                    amount: amount,
                  })
                )}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
