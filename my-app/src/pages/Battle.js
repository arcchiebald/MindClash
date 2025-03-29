import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Battle.css';

const Battle = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [foundOpponent, setFoundOpponent] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [selectedSubject, setSelectedSubject] = useState('Math');
  const navigate = useNavigate();

  // Mock opponents data
  const mockOpponents = [
    { id: 1, name: 'MathMaster99', grade: 11, avatar: '🧑🏫', wins: 42 },
    { id: 2, name: 'AlgebraAce', grade: 10, avatar: '👩💻', wins: 38 },
    { id: 3, name: 'GeoGenius', grade: 12, avatar: '🧑🎓', wins: 55 },
  ];

  const handleReadyClick = () => {
    if (!isSearching && !foundOpponent) {
      setIsSearching(true);
      
      setTimeout(() => {
        const opponent = mockOpponents[
          Math.floor(Math.random() * mockOpponents.length)
        ];
        setIsSearching(false);
        setFoundOpponent(opponent);
        startCountdown(opponent); // Pass opponent directly here
      }, 2000);
    }
  };
  
  const startCountdown = (opponent) => { // Accept opponent as parameter
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/battle/session', {
            state: {
              opponent: opponent, // Use the parameter
              user: { name: "You", avatar: "🧑💻", grade: 10 },
              subject: selectedSubject,
            }
          });
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

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  return (
    <div className="battle-container">
      <div className="subject-select-container">
        <label htmlFor="subject">Choose Subject:</label>
        <select
          id="subject"
          value={selectedSubject}
          onChange={handleSubjectChange}
          className="subject-select"
        >
          <option value="Math">Math</option>
          <option value="English">English</option>
          <option value="History">History</option>
        </select>
      </div>

      <div className="battle-panels">
        <div className="user-panel">
          <div className="battle-avatar">🧑💻</div>
          <h3>You</h3>
          <p>Grade 10</p>
        </div>

        <div className="vs-circle">
          <span>VS</span>
          {isSearching && <div className="searching-pulse"></div>}
        </div>

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
            </div>
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Battle;