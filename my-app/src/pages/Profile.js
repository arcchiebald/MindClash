// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: 'MathWizard42',
    grade: 10,
    skillLevel: 0,  // Starts at 0
    wins: 0,        // Starts at 0
    crowns: 0,      // Starts at 0
    avatar: '🧑💻'
  });

  // Validate skill level never exceeds 100%
  useEffect(() => {
    if (profile.skillLevel > 100) {
      setProfile(prev => ({ ...prev, skillLevel: 100 }));
    }
  }, [profile.skillLevel]);

  // Simulate winning a battle
  const handleWin = () => {
    setProfile(prev => ({
      ...prev,
      wins: prev.wins + 1,
      crowns: prev.crowns + 1,
      skillLevel: Math.min(prev.skillLevel + 5, 100) // 5% increase per win
    }));
  };

  // Reset progress for testing
  const resetProgress = () => {
    setProfile(prev => ({
      ...prev,
      wins: 0,
      crowns: 0,
      skillLevel: 0
    }));
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{profile.avatar}</div>
          <h2>{profile.username}</h2>
        </div>

        <div className="profile-stats">
          {/* Grade Selector */}
          <div className="stat-item">
            <span className="stat-label">Grade</span>
            <select 
              value={profile.grade}
              onChange={(e) => setProfile({ ...profile, grade: e.target.value })}
              className="grade-selector"
            >
              {[9, 10, 11, 12].map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>

          {/* Skill Level Progress */}
          <div className="stat-item">
            <span className="stat-label">Learning Progress</span>
            <div className="skill-meter">
              <div 
                className="skill-progress" 
                style={{ width: `${profile.skillLevel}%` }}
              >
                {profile.skillLevel}%
              </div>
            </div>
          </div>

          {/* Wins Counter */}
          <div className="stat-item">
            <span className="stat-label">Battle Wins</span>
            <div className="wins-counter">
              🏆 {profile.wins}
              <button onClick={handleWin} className="test-button">
                Simulate Win (+1 Crown)
              </button>
            </div>
          </div>

          {/* Crowns Counter */}
          <div className="stat-item">
            <span className="stat-label">Crowns Earned</span>
            <div className="crown-counter">
              👑 {profile.crowns}
              <span className="crown-tooltip">(1 crown per victory)</span>
            </div>
          </div>
        </div>

        {/* Reset Button for Testing */}
        <button onClick={resetProgress} className="reset-button">
          Reset Progress
        </button>

        <Link to="/" className="back-button">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Profile;