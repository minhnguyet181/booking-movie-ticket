import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { movieService } from '../services/movie.service';
import { Movie, MovieCreate } from '../types/movie';
import Header from '../components/Header';
import Modal from '../components/Modal';
import './MovieManagementPage.css';

const MovieManagementPage = () => {
  const { isAuthenticated } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState<Partial<MovieCreate>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleEdit = (movie: Movie) => {
    setSelectedMovie(movie);
    setFormData({
      name: movie.name,
      country: movie.country,
      year: movie.year,
      genre: movie.genre,
      duration: movie.duration,
      age_restriction: movie.age_restriction,
      main_cast: movie.main_cast,
      description: movie.description,
      poster_url: movie.poster_url,
    });
    setError('');
    setSuccess('');
    setIsEditModalOpen(true);
  };

  const handleDelete = (movie: Movie) => {
    setSelectedMovie(movie);
    setError('');
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (selectedMovie) {
        await movieService.updateMovie(selectedMovie.id, formData);
        setSuccess('Successfully update movie\'s content!');
        await loadMovies();
        setTimeout(() => {
          setIsEditModalOpen(false);
          setSuccess('');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid information. Action failed!');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMovie) return;

    try {
      await movieService.deleteMovie(selectedMovie.id);
      setSuccess('Successfully delete movie\'s content!');
      setIsDeleteModalOpen(false);
      await loadMovies();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Deletion failed due to no content!');
      setIsDeleteModalOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'year' || name === 'duration' ? parseInt(value) : value,
    });
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

        {success && (
          <div className="success-banner">
            <span className="success-text">SUCCESSFUL!</span>
            <button className="success-close" onClick={() => setSuccess('')}>×</button>
            <p className="success-message">{success}</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <span className="error-text">ERROR</span>
            <button className="error-close" onClick={() => setError('')}>×</button>
            <p className="error-message">{error}</p>
          </div>
        )}

        <div className="movies-table-container">
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

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMovie(null);
          setFormData({});
          setError('');
          setSuccess('');
        }}
        title={selectedMovie?.name || 'Edit Movie'}
      >
        {success && (
          <div className="success-banner">
            <span className="success-text">SUCCESSFUL!</span>
            <p className="success-message">{success}</p>
          </div>
        )}
        {error && (
          <div className="error-banner">
            <span className="error-text">ERROR</span>
            <button className="error-close" onClick={() => setError('')}>×</button>
            <p className="error-message">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="movie-form">
          <div className="form-group">
            <label>Movie Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <select
              name="country"
              value={formData.country || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Korea">Korea</option>
              <option value="Japan">Japan</option>
              <option value="China">China</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
            </select>
          </div>
          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              name="year"
              value={formData.year || ''}
              onChange={handleInputChange}
              min="1900"
              max="2100"
              required
            />
          </div>
          <div className="form-group">
            <label>Genre</label>
            <select
              name="genre"
              value={formData.genre || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Genre</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Horror">Horror</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Thriller">Thriller</option>
              <option value="Romance">Romance</option>
              <option value="Animation">Animation</option>
            </select>
          </div>
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration || ''}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Age Restriction</label>
            <select
              name="age_restriction"
              value={formData.age_restriction || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Age Restriction</option>
              <option value="G">G - General Audiences</option>
              <option value="PG">PG - Parental Guidance</option>
              <option value="PG-13">PG-13 - Parents Strongly Cautioned</option>
              <option value="R">R - Restricted</option>
              <option value="NC-17">NC-17 - Adults Only</option>
            </select>
          </div>
          <div className="form-group">
            <label>Main Cast</label>
            <input
              type="text"
              name="main_cast"
              value={formData.main_cast || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Movie Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={5}
              required
            />
          </div>
          <div className="form-group">
            <label>Poster URL</label>
            <div className="poster-upload">
              <input
                type="text"
                name="poster_url"
                value={formData.poster_url || ''}
                onChange={handleInputChange}
                placeholder="Enter poster URL"
              />
              <button type="button" className="add-poster-btn">
                📷 Add Poster
              </button>
            </div>
            {formData.poster_url && (
              <img src={formData.poster_url} alt="Poster" className="poster-preview" />
            )}
          </div>
          <button type="submit" className="submit-btn">UPDATE</button>
        </form>
      </Modal>

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
    </div>
  );
};

export default MovieManagementPage;
