import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { movieService } from '../services/movie.service';
import { Movie, MovieCreate } from '../types/movie';
import { useToast } from '../contexts/ToastContext';
import Header from '../components/Header';
import SuccessErrorModal from '../components/SuccessErrorModal';
import './MovieFormPage.css';

const MovieFormPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { movieId } = useParams<{ movieId?: string }>();
  const location = useLocation();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<MovieCreate>>({
    name: '',
    country: '',
    year: new Date().getFullYear(),
    genre: '',
    duration: 0,
    age_restriction: '',
    main_cast: '',
    description: '',
    poster_url: '',
    image_url: '',
  });

  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [movie, setMovie] = useState<Movie | null>(null);

  const isEditMode = !!movieId;

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
      return;
    }

    if (isEditMode && movieId) {
      loadMovieData(parseInt(movieId));
    }
  }, [movieId, isAuthenticated, isAdmin, navigate]);

  const loadMovieData = async (id: number) => {
    try {
      setLoading(true);
      const response = await movieService.getAllMovies(1, 100);
      const currentMovie = response.movies.find(m => m.id === id);
      if (currentMovie) {
        setMovie(currentMovie);
        setFormData({
          name: currentMovie.name,
          country: currentMovie.country,
          year: currentMovie.year,
          genre: currentMovie.genre,
          duration: currentMovie.duration,
          age_restriction: currentMovie.age_restriction,
          main_cast: currentMovie.main_cast,
          description: currentMovie.description,
          poster_url: currentMovie.poster_url,
          image_url: currentMovie.image_url,
        });
      }
    } catch (error) {
      console.error('Error loading movie:', error);
      setErrorModal({ isOpen: true, message: 'Failed to load movie data' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'year' || name === 'duration' ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode && movieId) {
        await movieService.updateMovie(parseInt(movieId), formData);
        setSuccessModal({ isOpen: true, message: 'Successfully updated movie!' });
      } else {
        await movieService.createMovie(formData as MovieCreate);
        setSuccessModal({ isOpen: true, message: 'Successfully created movie!' });
      }

      setTimeout(() => {
        navigate('/manage-movies');
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Failed!';
      setErrorModal({ isOpen: true, message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="movie-form-page">
        <Header />
        <div className="unauthorized">Admin access required</div>
      </div>
    );
  }

  return (
    <div className="movie-form-page">
      <Header />
      <div className="form-container">
        <div className="form-header">
          <h1>{isEditMode ? `Edit: ${movie?.name || 'Loading...'}` : 'Add New Movie'}</h1>
          <button className="back-btn" onClick={() => navigate('/manage-movies')}>← Back</button>
        </div>

        <form onSubmit={handleSubmit} className="movie-form">
          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label>Movie Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Enter movie name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Country *</label>
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
                <label>Duration (minutes) *</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration || ''}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="e.g. 120"
                  required
                />
              </div>

              <div className="form-group">
                <label>Main Cast *</label>
                <input
                  type="text"
                  name="main_cast"
                  value={formData.main_cast || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Actor 1, Actor 2"
                  required
                />
              </div>

              <div className="form-group">
                <label>Movie Description *</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Enter movie description"
                  required
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Year *</label>
                <select
                  name="year"
                  value={formData.year || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 125 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Genre *</label>
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
                <label>Age Restriction *</label>
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
                <label>Poster URL</label>
                <input
                  type="text"
                  name="poster_url"
                  value={formData.poster_url || ''}
                  onChange={handleInputChange}
                  placeholder="Enter poster image URL"
                />
              </div>

              <div className="poster-preview-section">
                {formData.poster_url && (
                  <div className="poster-preview-box">
                    <img src={formData.poster_url} alt="Poster Preview" className="poster-preview" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/manage-movies')} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'UPDATE' : 'CREATE'}
            </button>
          </div>
        </form>
      </div>

      <SuccessErrorModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, message: '' })}
        message={successModal.message}
        type="success"
      />

      <SuccessErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        message={errorModal.message}
        type="error"
      />
    </div>
  );
};

export default MovieFormPage;