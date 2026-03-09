import Header from '../components/Header';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <div className="hero-section">
        <div className="hero-content">
          <div className="movie-poster">
            <div className="poster-overlay">
              <div className="poster-info">
                <h1 className="movie-title">I, THE EXECUTIONER</h1>
                <p className="movie-subtitle">A VETERAN STORY</p>
                <p className="movie-date">25 SEPTEMBER</p>
                <button className="book-now-btn">Book Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
