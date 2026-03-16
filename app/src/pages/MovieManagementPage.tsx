import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { movieService } from '../services/movie.service';
import { Movie } from '../types/movie';
import Header from '../components/Header';
import Modal from '../components/Modal';
import SuccessErrorModal from '../components/SuccessErrorModal';
import './MovieManagementPage.css';

const MovieManagementPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadMovies();
    }
  }, [currentPage, searchQuery, isAuthenticated]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getAllMovies(currentPage, 10, searchQuery || undefined);
      setMovies(response.movies);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigate('/manage-movies/add');
  };

  const handleEdit = (movie: Movie) => {
    navigate(`/manage-movies/edit/${movie.id}`);
  };

  const handleDelete = (movie: Movie) => {
    setSelectedMovie(movie);
    setError('');
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (selectedMovie) {
        // Update existing movie
        await movieService.updateMovie(selectedMovie.id, {});
        setSelectedMovie(null);
        await loadMovies();
        setSuccessModal({ isOpen: true, message: 'Successfully update movie\'s content!' });
      } else {
        // Create new movie
        await loadMovies();
        setSuccessModal({ isOpen: true, message: 'Successfully create movie!' });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Invalid information. Action failed!';
      setError(errorMessage);
      setErrorModal({ isOpen: true, message: errorMessage });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMovie) return;

    try {
      await movieService.deleteMovie(selectedMovie.id);
      setIsDeleteModalOpen(false);
      setSelectedMovie(null);
      await loadMovies();
      setSuccessModal({ isOpen: true, message: 'Successfully delete movie\'s content!' });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Deletion failed due to no content!';
      setIsDeleteModalOpen(false);
      setErrorModal({ isOpen: true, message: errorMessage });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadMovies();
  };

  if (!isAuthenticated) {
    return (
      <div className="movie-management-page">
        <Header />
        <div className="unauthorized">Please login to access this page</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="movie-management-page">
        <Header />
        <div className="unauthorized">Admin access required. You don't have permission to access this page.</div>
      </div>
    );
  }

  return (
    <div className="movie-management-page">
      <Header />
      <div className="content-management">
        <div className="content-header">
          <h1 className="content-title">CONTENT MANAGEMENT</h1>
          <div className="header-actions">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </form>
            <div className="user-menu">
              <div className="user-icon">U</div>
            </div>
          </div>
        </div>

        <div className="movies-table-container">
          <div className="table-header-actions">
            <button className="add-movie-btn" onClick={handleAdd}>
              <span className="add-icon">👁️</span> ADD
            </button>
          </div>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <table className="movies-table">
              <thead>
                <tr>
                  <th>MOVIE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {movies.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="no-movies">No movies found</td>
                  </tr>
                ) : (
                  movies.map((movie) => (
                    <tr key={movie.id}>
                      <td className="movie-name">{movie.name}</td>
                      <td className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(movie)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(movie)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMovie(null);
        }}
        title="DELETE INFORMATION"
      >
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this movie's content?</p>
          <div className="delete-actions">
            <button className="delete-confirm-btn" onClick={handleDeleteConfirm}>
              DELETE
            </button>
            <button className="cancel-btn" onClick={() => setIsDeleteModalOpen(false)}>
              CANCEL
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <SuccessErrorModal
        isOpen={successModal.isOpen}
        type="success"
        message={successModal.message}
        onClose={() => setSuccessModal({ isOpen: false, message: '' })}
      />

      {/* Error Modal */}
      <SuccessErrorModal
        isOpen={errorModal.isOpen}
        type="error"
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
      />
    </div>
  );
};

export default MovieManagementPage;
