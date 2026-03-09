import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Modal from '../components/Modal';
import './AuthPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
      setIsOpen(false);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed! Please check your information carefully!');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="auth-page">
      <Header />
      <Modal isOpen={isOpen} onClose={handleClose} title="LOG IN">
        {error && (
          <div className="error-banner">
            <span className="error-text">ERROR</span>
            <button className="error-close" onClick={() => setError('')}>×</button>
            <p className="error-message">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox-input"
              />
              <span>Remember me</span>
            </label>
          </div>
          <button type="submit" className="auth-button">
            LOG IN
          </button>
          <p className="auth-link-text">
            Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
          </p>
          <p className="auth-link-text">
            <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
          </p>
        </form>
      </Modal>
    </div>
  );
};

export default LoginPage;
