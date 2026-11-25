import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { createLoanRequest, getBooksRequest } from '../services/bibliotecaService';

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado para Modal A2 (Solicitud de Préstamo)
  const [selectedBook, setSelectedBook] = useState(null);
  const [fechaDevolucionEstimada, setFechaDevolucionEstimada] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getBooksRequest(search, categoria);
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el catálogo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, categoria]);

  const handleSelect = (book) => {
    if (book.stockDisponible <= 0) return;
    setSelectedBook(book);
    setFechaDevolucionEstimada('');
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setFechaDevolucionEstimada('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fechaDevolucionEstimada) {
      alert('Selecciona una fecha de devolución estimada.');
      return;
    }

    try {
      setSubmitting(true);
      await createLoanRequest({
        bookId: selectedBook.id,
        userId: user.id,
        fechaDevolucionEstimada,
      });
      alert('Préstamo registrado correctamente.');
      handleCloseModal();
      fetchBooks();
    } catch (err) {
      alert(err.message || 'Error al solicitar el préstamo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <div className="page-header">
          <h1>Catálogo de Libros</h1>
        </div>

        <div className="filters-bar">
          <div className="search-box">
            <Search size={18} color="#64748B" />
            <input
              type="text"
              placeholder="Buscar por título o autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            <option value="Software">Software</option>
            <option value="Redes">Redes</option>
            <option value="Bases de Datos">Bases de Datos</option>
            <option value="Seguridad">Seguridad</option>
            <option value="Matemáticas">Matemáticas</option>
          </select>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <p className="text-muted">Cargando catálogo de libros...</p>
        ) : books.length === 0 ? (
          <div className="card">
            <p className="text-muted">No se encontraron libros con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.map((book) => {
              const disponible = book.stockDisponible > 0;
              return (
                <article key={book.id} className="card book-card">
                  <div className="book-card-top">
                    <span className="badge badge-category">{book.categoria}</span>
                    <span className={disponible ? 'badge badge-success' : 'badge badge-danger'}>
                      {disponible ? `Disponible: ${book.stockDisponible}` : 'Agotado'}
                    </span>
                  </div>

                  <h3 className="book-title">{book.titulo}</h3>
                  <p className="book-author">{book.autor}</p>
                  <p className="book-isbn">ISBN: {book.isbn}</p>

                  <button
                    className="btn-primary w-full"
                    disabled={!disponible}
                    onClick={() => handleSelect(book)}
                  >
                    {disponible ? 'Solicitar Préstamo' : 'Sin Stock'}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {selectedBook && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Solicitar Préstamo</h2>
              <button onClick={handleCloseModal} className="btn-icon">
                <X size={20} />
              </button>
            </div>

            <div className="book-summary">
              <strong>{selectedBook.titulo}</strong>
              <p className="text-muted">Autor: {selectedBook.autor}</p>
              <p className="book-isbn">ISBN: {selectedBook.isbn}</p>
            </div>

            <form onSubmit={handleSubmit} className="form-stack">
              <div className="form-group">
                <label htmlFor="fechaDevolucionEstimada">Fecha de devolución estimada</label>
                <input
                  id="fechaDevolucionEstimada"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={fechaDevolucionEstimada}
                  onChange={(e) => setFechaDevolucionEstimada(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Confirmando...' : 'Confirmar Préstamo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}