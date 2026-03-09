import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Modal from '../components/Modal';
import './AuthPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(formData);
      setIsOpen(false);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed!');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="auth-page">
      <Header />
      <Modal isOpen={isOpen} onClose={handleClose} title="SIGN UP">
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
              name="username"
              placeholder="Enter username..."
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Enter email..."
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Create password..."
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password..."
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="full_name"
              placeholder="Full name (optional)"
              value={formData.full_name}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <button type="submit" className="auth-button">
            SIGN UP
          </button>
          <p className="auth-link-text">
            Already have an account? <Link to="/login" className="auth-link">Log in</Link>
          </p>
        </form>
      </Modal>
    </div>
  );
};

export default RegisterPage;
