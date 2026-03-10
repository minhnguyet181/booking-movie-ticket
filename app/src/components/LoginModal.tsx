import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import SuccessErrorModal from './SuccessErrorModal';
import '../pages/AuthPage.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(username, password);
      setSuccessModal({ isOpen: true, message: 'Successful!' });
      setUsername('');
      setPassword('');
      setRememberMe(false);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorModal({
        isOpen: true,
        message: err.response?.data?.error || 'Login failed! Please check your information carefully!',
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="LOG IN" contentClassName="auth-modal-content">
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <div className="input-wrapper">
            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>
        <div className="form-group checkbox-group">
          <label className="checkbox-label" htmlFor="remember-me">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="checkbox-input"
            />
            <span>Remember me</span>
          </label>
        </div>
        <div className="auth-button-container">
          <button type="submit" className="auth-button">
            LOG IN
          </button>
        </div>
        <p className="auth-link-text">
          Don't have an account? <Link to="/register" className="auth-link" onClick={onClose}>Sign up</Link>
        </p>
        <p className="auth-link-text">
          <Link to="/forgot-password" className="auth-link" onClick={onClose}>Forgot password?</Link>
        </p>
      </form>
      </Modal>

      <SuccessErrorModal
        isOpen={successModal.isOpen}
        type="success"
        message={successModal.message}
        onClose={() => setSuccessModal({ isOpen: false, message: '' })}
      />

      <SuccessErrorModal
        isOpen={errorModal.isOpen}
        type="error"
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
      />
    </>
  );
};

export default LoginModal;
