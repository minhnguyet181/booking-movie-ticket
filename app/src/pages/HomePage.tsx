import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated && isAdmin) {
      navigate('/admin-dashboard');
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-page">
      <Header />
      <div className="hero-section">
        <div className="movie-poster"></div>
      </div>
    </div>
  );
};

export default HomePage;
