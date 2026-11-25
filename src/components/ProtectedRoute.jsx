import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <div className="card" style={{ maxWidth: '450px', margin: '0 auto' }}>
          <h2 style={{ color: '#991B1B' }}>403 - Acceso Restringido</h2>
          <p>No cuentas con permisos de administrador para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;