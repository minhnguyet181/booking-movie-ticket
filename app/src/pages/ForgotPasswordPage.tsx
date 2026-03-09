import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import Header from '../components/Header';
import Modal from '../components/Modal';
import './AuthPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message);
      if (response.resetToken) {
        // In development, show token. In production, this would be sent via email
        setMessage(`Reset token: ${response.resetToken} (This is only shown in development)`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send reset email');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="auth-page">
      <Header />
      <Modal isOpen={isOpen} onClose={handleClose} title="FORGOT PASSWORD">
        {error && (
          <div className="error-banner">
            <span className="error-text">ERROR</span>
            <button className="error-close" onClick={() => setError('')}>×</button>
            <p className="error-message">{error}</p>
          </div>
        )}
        {message && (
          <div className="success-banner">
            <p className="success-message">{message}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="auth-button">
            SEND RESET LINK
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ForgotPasswordPage;
