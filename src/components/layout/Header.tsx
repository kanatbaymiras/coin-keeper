import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import type { RootState } from "../../store/store";
import { Link } from "react-router";

const Header = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const email = user?.email; // Опциональная цепочка для безопасного доступа к email

  const handleLogout = () => {
    dispatch(logout()); // Вызываем экшн logout для выхода
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="text-xl font-semibold text-indigo-600">Coin Keeper</div>
      <div className="flex items-center space-x-4">
        <Link to="/statistics" className="px-4 py-2 hover:bg-gray-100">
          Статистика
        </Link>
        {email && <span className="text-sm text-gray-700">{email}</span>}
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-700 focus:outline-none cursor-pointer"
        >
          Выйти
        </button>
      </div>
    </header>
  );
};

export default Header;
