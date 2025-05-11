import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import PasswordVisibilityIcon from "../components/icons/PasswordVisibilityIcon";
import ErrorMessage from "../error/ErrorMessage";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../store/slices/authSlice";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";

// Регулярное выражение для проверки email
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  const errorBlockHeight = "min-h-[60px]";

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        document
          .getElementById("welcome-message")
          ?.classList.replace("opacity-0", "opacity-100");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    console.log("Form data:", form); // Логируем данные формы

    // Проверка на пустое поле или неправильный формат email
    if (!form.email || !isValidEmail(form.email)) {
      setValidationError("Неверный формат email");
      return;
    }

    if (!form.password) {
      setValidationError("Пароль не может быть пустым");
      return;
    }

    try {
      await dispatch(loginUser(form)).unwrap();
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (user) {
    return (
      <div
        id="welcome-message"
        className="mt-8 bg-white shadow-lg rounded-lg p-6 transform transition-all duration-500 ease-in-out opacity-0"
      >
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Добро пожаловать, {user.email}!
          </h2>
          <p className="mt-2 text-gray-600">Текущий баланс: {user.balance} ₽</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-6">
            Перейти к управлению финансами
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Вход в аккаунт
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Введите свои данные для доступа
          </p>
        </div>

        <div className={errorBlockHeight}>
          {(error || validationError) && (
            <ErrorMessage
              message={error || validationError || ""}
              className="opacity-100 transition-opacity duration-300"
            />
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <InputField
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <div className="relative">
              <InputField
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Пароль"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
              >
                <PasswordVisibilityIcon show={showPassword} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Запомнить меня
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Забыли пароль?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading || !isValidEmail(form.email) || !form.password}
            fullWidth
          >
            {loading ? "Вход..." : "Войти"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Нет учетной записи?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
