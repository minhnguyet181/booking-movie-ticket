import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import LoginModal from './LoginModal';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logout successful!', 'success');
      navigate('/');
    } catch (e: any) {
      showToast('Logout failed!', 'error');
    } finally {
      setShowDropdown(false);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          FilmHub
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">HOME</Link>
          <Link to="/movies" className="nav-link">MOVIE</Link>
          <Link to="/tickets" className="nav-link">TICKET</Link>
          <Link to="/contact" className="nav-link">CONTACT</Link>
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/manage-movies" className="nav-link">MANAGE MOVIES</Link>
          )}
        </nav>
        <div className="header-right">
          <div className="search-bar">
            <input type="text" placeholder="Search..." className="search-input" />
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="user-menu">
            {isAuthenticated ? (
              <div className="user-dropdown">
                <button
                  className="user-icon"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {user?.username.charAt(0).toUpperCase()}
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      Update Profile
                    </Link>
                    <Link to="/booking-history" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      Booking History
                    </Link>
                    <Link to="/reset-password" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      Reset password
                    </Link>
                    <Link to="/delete-account" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      Delete Account
                    </Link>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-btn" onClick={() => setShowLoginModal(true)}>
                <svg className="account-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )
            }
          </div>
        </div>
      </div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </header>
  );
};

export default Header;
