import { Navigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useData();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}