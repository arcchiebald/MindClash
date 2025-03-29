import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './BattleSession.css';

const BattleSession = () => {
    const location = useLocation();
    const { user, opponent, subject } = location.state || {};
  
    if (!opponent) {
      return (
        <div className="battle-session-container">
          <h2>Error: No opponent data received</h2>
          <p>Possible reasons:</p>
          <ul>
            <li>Direct URL access without matchmaking</li>
            <li>Connection timeout</li>
          </ul>
          <Link to="/battle" className="back-button">
            ← Back to Matchmaking
          </Link>
        </div>
      );
    }
  
    return (
      <div className="battle-session-container">
        <div className="players-container">
          {/* User Card */}
          <div className="player-card">
            <div className="avatar">{user?.avatar}</div>
            <h3>{user?.name}</h3>
            <p>Grade {user?.grade}</p>
            <p className="subject-badge">{subject}</p>
          </div>
  
          <div className="vs">VS</div>
  
          {/* Opponent Card */}
          <div className="player-card">
            <div className="avatar">{opponent.avatar}</div>
            <h3>{opponent.name}</h3>
            <p>Grade {opponent.grade}</p>
            <div className="win-stats">
              🏆 {opponent.wins} Career Wins
            </div>
          </div>
        </div>
  
        {/* ... rest of your battle interface ... */}
      </div>
    );
  };

  export default BattleSession;