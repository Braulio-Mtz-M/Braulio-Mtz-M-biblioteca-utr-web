import { useEffect, useState } from 'react';
import { UserCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getLoansRequest } from '../services/bibliotecaService';

export default function Perfil() {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const data = await getLoansRequest();
        setLoans(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Error al obtener tus préstamos.');
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  return (
    <div>
      <Navbar />
      <main className="container">
        {/* Tarjeta de Perfil del Usuario */}
        <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="auth-icon" style={{ marginBottom: 0 }}>
            <UserCheck size={28} color="#1E3A8A" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem' }}>{user?.nombre}</h2>
            <p className="text-muted">
              Matrícula: <strong>{user?.matricula || 'N/A'}</strong> · Correo: {user?.email} · Rol:{' '}
              <span className="badge badge-category">{user?.rol}</span>
            </p>
          </div>
        </div>

        {/* Sección A3 - Mis Préstamos */}
        <div className="page-header">
          <h1>Mis Préstamos</h1>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <p className="text-muted">Cargando historial de préstamos...</p>
        ) : loans.length === 0 ? (
          <div className="card">
            <p className="text-muted">Aún no tienes préstamos registrados.</p>
          </div>
        ) : (
          <div className="card table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Libro</th>
                  <th>Fecha Préstamo</th>
                  <th>Fecha Límite</th>
                  <th>Estatus</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => {
                  const id = loan.loanId || loan.id;
                  const isReturned = loan.estatus === 'DEVUELTO';
                  return (
                    <tr key={id}>
                      <td>
                        <strong>{loan.libro || loan.book?.titulo}</strong>
                      </td>
                      <td>{loan.fechaPrestamo?.slice(0, 10) || '—'}</td>
                      <td>{loan.fechaDevolucionEstimada?.slice(0, 10) || '—'}</td>
                      <td>
                        <span className={isReturned ? 'badge badge-success' : 'badge badge-warning'}>
                          {loan.estatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}