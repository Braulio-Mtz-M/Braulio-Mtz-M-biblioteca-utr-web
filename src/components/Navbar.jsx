import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          <BookOpen size={22} />
          <span>Biblioteca UTR</span>
        </Link>

        <nav className="navbar-links">
          <Link
            to="/dashboard"
            className={location.pathname === '/dashboard' ? 'nav-link active' : 'nav-link'}
          >
            Catálogo
          </Link>
          <Link
            to="/perfil"
            className={location.pathname === '/perfil' ? 'nav-link active' : 'nav-link'}
          >
            Perfil y Préstamos
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={location.pathname === '/admin' ? 'nav-link active' : 'nav-link'}
            >
              Panel Admin
            </Link>
          )}
        </nav>

        <div className="navbar-user">
          <span className="user-badge">
            {user?.nombre} ({user?.rol})
          </span>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={16} />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}