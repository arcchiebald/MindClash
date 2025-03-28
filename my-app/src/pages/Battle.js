// src/pages/Battle.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Battle.css';

const Battle = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [foundOpponent, setFoundOpponent] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [userReady, setUserReady] = useState(false);
  
  // Mock opponents data
  const mockOpponents = [
    { id: 1, name: 'MathMaster99', grade: 11, avatar: '🧑🏫', wins: 42 },
    { id: 2, name: 'AlgebraAce', grade: 10, avatar: '👩💻', wins: 38 },
    { id: 3, name: 'GeoGenius', grade: 12, avatar: '🧑🎓', wins: 55 },
  ];

  const handleReadyClick = () => {
    if (!isSearching && !foundOpponent) {
      setIsSearching(true);
      
      // Mock opponent search delay
      setTimeout(() => {
        setIsSearching(false);
        const opponent = mockOpponents[
          Math.floor(Math.random() * mockOpponents.length)
        ];
        setFoundOpponent(opponent);
        startCountdown();
      }, 2000);
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Start battle here later
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancel = () => {
    setIsSearching(false);
    setFoundOpponent(null);
    setCountdown(5);
  };

  return (
    <div className="battle-container">
      <div className="battle-panels">
        {/* Current User Panel */}
        <div className="user-panel">
          <div className="battle-avatar">🧑💻</div>
          <h3>You</h3>
          <p>Grade 10</p>
          <div className={`ready-status ${userReady ? 'ready' : ''}`}>
            {userReady ? 'Ready!' : 'Not Ready'}
          </div>
        </div>

        {/* VS Separator */}
        <div className="vs-circle">
          <span>VS</span>
          {isSearching && <div className="searching-pulse"></div>}
        </div>

        {/* Opponent Panel */}
        <div className="opponent-panel">
          {foundOpponent ? (
            <>
              <div className="battle-avatar">{foundOpponent.avatar}</div>
              <h3>{foundOpponent.name}</h3>
              <p>Grade {foundOpponent.grade}</p>
              <div className="win-stats">🏆 {foundOpponent.wins} Wins</div>
            </>
          ) : (
            <div className="opponent-placeholder">
              {isSearching ? 'Searching opponent...' : 'Waiting for opponent'}
            </div>
          )}
        </div>
      </div>

      {/* Battle Controls */}
      <div className="battle-controls">
        {!foundOpponent ? (
          <button
            onClick={handleReadyClick}
            className={`ready-button ${isSearching ? 'searching' : ''}`}
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <div className="search-spinner"></div>
                Searching...
              </>
            ) : (
              'Ready Up!'
            )}
          </button>
        ) : (
          <div className="countdown-container">
            <div className="countdown-timer">
              Starting in {countdown}
              <div 
                className="countdown-progress" 
                style={{ width: `${(countdown / 5) * 100}%` }}
              ></div>
            </div>
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        )}
      </div>

      <Link to="/" className="back-button">
        ← Back to Home
      </Link>
    </div>
  );
};

export default Battle;