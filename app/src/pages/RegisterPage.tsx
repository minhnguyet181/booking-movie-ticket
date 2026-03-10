import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Header from '../components/Header';
import Modal from '../components/Modal';
import './AuthPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const { register } = useAuth();
  const { showToast } = useToast();
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
      // Auto-generate email from username for backend compatibility
      const registerData = {
        ...formData,
        email: `${formData.username}@filmhub.local`,
      };
      await register(registerData);
      setIsOpen(false);
      showToast('Registration successful! Please login.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 500);
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
      <Modal isOpen={isOpen} onClose={handleClose} title="SIGN UP" contentClassName="auth-modal-content">
        {error && (
          <div className="error-banner">
            <span className="error-text">ERROR</span>
            <button className="error-close" onClick={() => setError('')}>×</button>
            <p className="error-message">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
          </div>
          <div className="form-group">
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
          </div>
          <div className="form-group">
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
          </div>
          <div className="auth-button-container">
            <button type="submit" className="auth-button">
              SIGN UP
            </button>
          </div>
          <p className="auth-link-text">
            Already have an account? <Link to="/login" className="auth-link">Log in</Link>
          </p>
        </form>
      </Modal>
    </div>
  );
};

export default RegisterPage;
