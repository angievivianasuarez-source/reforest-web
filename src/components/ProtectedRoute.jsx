import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('reforest_token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
