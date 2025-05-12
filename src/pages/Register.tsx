import { registerUser, clearError } from "../store/slices/authSlice";
import React, { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import ErrorMessage from "../error/ErrorMessage";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
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

  // Валидация отдельных полей при изменении значений
  useEffect(() => {
    validateField("email", email);
  }, [email]);

  useEffect(() => {
    validateField("password", password);
  }, [password]);

  useEffect(() => {
    validateField("confirmPassword", confirmPassword);
  }, [confirmPassword, password]);

  const validateField = (
    field: "email" | "password" | "confirmPassword",
    value: string
  ): boolean => {
    // Проверяем только если поле было "затронуто"
    if (!touched[field]) return true;

    switch (field) {
      case "email": {
        if (!value.trim()) {
          setValidationError("Email обязателен");
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setValidationError("Введите корректный email");
          return false;
        }
        break;
      }
      case "password": {
        if (!value.trim()) {
          setValidationError("Пароль обязателен");
          return false;
        }
        if (value.length < 6) {
          setValidationError("Пароль должен содержать минимум 6 символов");
          return false;
        }
        if (confirmPassword && value !== confirmPassword) {
          setValidationError("Пароли не совпадают");
          return false;
        }
        break;
      }
      case "confirmPassword": {
        if (value !== password) {
          setValidationError("Пароли не совпадают");
          return false;
        }
        break;
      }
    }

    // Если все проверки пройдены, очищаем ошибку
    setValidationError(null);
    return true;
  };

  const validateForm = (): boolean => {
    // Отмечаем все поля как "затронутые"
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Проверяем каждое поле
    const isEmailValid = validateField("email", email);
    const isPasswordValid = validateField("password", password);
    const isConfirmPasswordValid = validateField(
      "confirmPassword",
      confirmPassword
    );

    return isEmailValid && isPasswordValid && isConfirmPasswordValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await dispatch(registerUser({ email, password }));
  };

  const handleInputBlur = (field: "email" | "password" | "confirmPassword") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(
      field,
      field === "email"
        ? email
        : field === "password"
        ? password
        : confirmPassword
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Регистрация
        </h2>

        {(error || validationError) && (
          <ErrorMessage
            message={validationError || error || ""}
            className="mb-3"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
            required
            className="w-full"
            onBlur={() => handleInputBlur("email")}
          />

          <div className="relative">
            <InputField
              type={showPassword ? "text" : "password"}
              label="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
              className="w-full pr-10"
              onBlur={() => handleInputBlur("password")}
            />
            <button
              type="button"
              className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700 focus:outline-none"
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

          <div className="relative">
            <InputField
              type={showPassword ? "text" : "password"}
              label="Подтверждение пароля"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите пароль"
              required
              className="w-full pr-10"
              onBlur={() => handleInputBlur("confirmPassword")}
            />
          </div>

          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Уже есть аккаунт? </span>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => navigate("/login")}
              >
                Войти
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
