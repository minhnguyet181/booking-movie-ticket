import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service';
import Header from '../components/Header';
import Modal from '../components/Modal';
import './AuthPage.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid reset token');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    try {
      await authService.resetPassword(token, password, confirmPassword);
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  if (success) {
    return (
      <div className="auth-page">
        <Header />
        <Modal isOpen={isOpen} onClose={handleClose} title="SUCCESSFUL!">
          <div className="success-banner">
            <p className="success-message">Password reset successful! Redirecting to login...</p>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <Header />
      <Modal isOpen={isOpen} onClose={handleClose} title="RESET PASSWORD">
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
              type="password"
              placeholder="Enter new password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm new password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="auth-button">
            RESET PASSWORD
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ResetPasswordPage;
