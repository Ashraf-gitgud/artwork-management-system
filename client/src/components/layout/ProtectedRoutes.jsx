import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../features/auth/authSlice';

export default function ProtectedRoute() {
  const isAuth = useSelector(selectIsAuthenticated);
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}