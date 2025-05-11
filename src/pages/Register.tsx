import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registerUser } from "../store/slices/authSlice";
import type { RootState } from "../store/store";
import { Link, useNavigate } from "react-router";
import ErrorMessage from "../error/ErrorMessage";
import PasswordVisibilityIcon from "../components/icons/PasswordVisibilityIcon";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (form.password !== form.confirmPassword) {
      setValidationError("Пароли не совпадают");
      return;
    }

    dispatch(registerUser({ email: form.email, password: form.password }))
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.error("Registration failed:", err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Создание аккаунта
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Заполните форму для регистрации в финансовом трекере
          </p>
        </div>

        {error && <ErrorMessage message={error} />}
        {validationError && <ErrorMessage message={validationError} />}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <InputField
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <div className="relative">
              <InputField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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
            <div className="relative">
              <InputField
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Подтвердите пароль"
                // Убираем errorMessage здесь
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
              >
                <PasswordVisibilityIcon show={showConfirmPassword} />
              </button>
            </div>
          </div>

          <div>
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? "Загрузка..." : "Зарегистрироваться"}
            </Button>
          </div>
        </form>
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-600">
            Уже есть аккаунт?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
