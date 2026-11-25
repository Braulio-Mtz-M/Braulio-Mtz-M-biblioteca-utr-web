import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: '#1E3A8A' }}>404</h1>
        <h2 style={{ marginBottom: '0.5rem' }}>Página no encontrada</h2>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
          La ruta que intentas visitar no existe en el sistema de Biblioteca UTR.
        </p>
        <Link to="/dashboard" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          Volver al Catálogo
        </Link>
      </div>
    </div>
  );
}