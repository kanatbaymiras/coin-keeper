// src/components/PrivateRoute.tsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import type { RootState } from "../store/store";

const PrivateRoute = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
