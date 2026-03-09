import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowDropdown(false);
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
          {isAuthenticated && (
            <Link to="/manage-movies" className="nav-link">MANAGE MOVIES</Link>
          )}
        </nav>
        <div className="header-right">
          <div className="search-bar">
            <input type="text" placeholder="Search..." className="search-input" />
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
              <button className="login-btn" onClick={() => navigate('/login')}>
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
