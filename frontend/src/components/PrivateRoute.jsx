import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function PrivateRoute({ children }) {
  const { organizador } = useAuth();
  return organizador ? children : <Navigate to="/login" replace />;
}
