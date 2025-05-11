import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import type { RootState } from "../store/store";

const PublicRoute = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return !user ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
