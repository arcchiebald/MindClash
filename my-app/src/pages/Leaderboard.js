// src/pages/Leaderboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Leaderboard.css';

const Leaderboard = () => {
  const georgianPlayers = [
    { name: "paika", elo: 2450, flag: "🇬🇪" },
    { name: "chitowitch123", elo: 2345, flag: "🇬🇪" },
    { name: "cxedariE3ze", elo: 2280, flag: "🇬🇪" },
    { name: "xarata", elo: 2245, flag: "🇬🇪" },
    { name: "tutku", elo: 2200, flag: "🇬🇪" },
    { name: "Andriaa", elo: 2185, flag: "🇬🇪" },
    { name: "vigindara", elo: 2150, flag: "🇬🇪" },
    { name: "chadubadu", elo: 2120, flag: "🇬🇪" },
    { name: "medeeaaaatxa", elo: 2105, flag: "🇬🇪" },
    { name: "8ze jimshi dzmaa", elo: 2080, flag: "🇬🇪" },
    { name: "tylasho", elo: 2060, flag: "🇬🇪" }

  ];

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <h2 className="leaderboard-title">MindClash Leaderboard 🏆</h2>
        
        <div className="leaderboard-list">
          {georgianPlayers.map((player, index) => (
            <div 
              key={index}
              className={`leaderboard-item ${index === 0 ? 'first-place' : ''}`}
            >
              <div className="position">#{index + 1}</div>
              <div className="player-info">
                <span className="flag">{player.flag}</span>
                <span className="name">{player.name}</span>
              </div>
              <div className="elo">{player.elo} ELO</div>
            </div>
          ))}
        </div>

        <Link to="/" className="back-button">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Leaderboard;