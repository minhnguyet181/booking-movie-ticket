import Header from '../components/Header';
import './HomePage.css';

const HomePage = () => {
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
