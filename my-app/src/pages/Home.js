// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const isLoggedIn = Boolean(localStorage.getItem('authToken'));

  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="home-header">
        <div className="logo-section">
          <h1 className="logo">MindClash</h1>
          <p className="tagline">Learn. Compete. Excel.</p>
        </div>
        <div className="header-buttons">
          <Link to="/leaderboard" className="leaderboard-button">
            🏆 Leaderboard
          </Link>
          {isLoggedIn ? (
            <Link to="/profile" className="profile-button">
              👤 Profile
            </Link>
          ) : (
            <Link to="/login" className="login-button">
              Login
            </Link>
          )}
        </div>
      </header>

      {/* Rest of your existing code remains unchanged */}
      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h2>Master High School Subjects Through AI-Powered Battles</h2>
          <p className="hero-description">
            Level up your knowledge in grades 9-12 subjects through interactive 
            learning modules and real-time quiz battles against peers.
          </p>
          <div className="cta-buttons">
            <Link to="/learn" className="cta-button learn-cta">
              Start Learning
            </Link>
            <Link to="/battle" className="cta-button battle-cta">
              Challenge Someone
            </Link>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>AI-Powered Lessons</h3>
          <p>Personalized learning materials for grades 9-12</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Live 1v1 Battles</h3>
          <p>Test knowledge in real-time against friends</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📈</div>
          <h3>Progress Tracking</h3>
          <p>Monitor your learning journey with detailed stats</p>
        </div>
      </section>
    </div>
  );
};

export default Home;