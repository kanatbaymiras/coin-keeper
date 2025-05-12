import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { loginUser, clearError } from "../store/slices/authSlice";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import ErrorMessage from "../error/ErrorMessage";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем на главную страницу
    if (user) {
      navigate("/");
    }

    // Очищаем ошибку при размонтировании компонента
    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, dispatch]);

  // Функция для валидации email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Валидация формы
  const validateForm = (): boolean => {
    if (!email.trim() && !password.trim()) {
      setFormError("Пожалуйста, заполните email и пароль");
      return false;
    }

    if (!email.trim()) {
      setFormError("Пожалуйста, введите email");
      return false;
    }

    if (!isValidEmail(email)) {
      setFormError("Пожалуйста, введите корректный email");
      return false;
    }

    if (!password.trim()) {
      setFormError("Пожалуйста, введите пароль");
      return false;
    }

    setFormError("");
    return true;
  };

  // Проверяем валидность формы при изменении полей
  useEffect(() => {
    console.log(user);
    if (touched.email || touched.password) {
      validateForm();
    }
  }, [email, password, touched, validateForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Помечаем все поля как "тронутые"
    setTouched({ email: true, password: true });

    // Валидируем форму перед отправкой
    if (!validateForm()) {
      return;
    }

    await dispatch(loginUser({ email, password }));
  };

  const handleInputChange = (field: "email" | "password", value: string) => {
    if (field === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }

    // Помечаем поле как "тронутое"
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Вход в аккаунт
        </h2>

        {(formError || error) && (
          <ErrorMessage message={formError || error || ""} className="mb-3" />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            type="email"
            label="Email"
            value={email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Введите email"
            required
            className="w-full"
          />

          <div className="relative">
            <InputField
              type={showPassword ? "text" : "password"}
              label="Пароль"
              value={password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Введите пароль"
              required
              className="w-full pr-10"
            />
            <button
              type="button"
              className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700 focus:outline-none z-20"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="3" y1="3" x2="21" y2="21" />
                </svg>
              )}
            </button>
          </div>

          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Вход..." : "Войти"}
            </Button>

            <div className="flex justify-between text-sm">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => navigate("/reset-password")}
              >
                Забыли пароль?
              </button>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => navigate("/register")}
              >
                Регистрация
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
