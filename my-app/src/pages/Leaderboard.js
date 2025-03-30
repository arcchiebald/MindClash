// src/pages/Leaderboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Leaderboard.css';
import axios from 'axios';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data from the API
    axios.get('http://127.0.0.1:8000/api/leaderboard')
      .then(response => {
        setPlayers(response.data);
      })
      .catch(error => {
        console.error('Error fetching leaderboard data:', error);
      });
  }, []);

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <h2 className="leaderboard-title">MindClash Leaderboard 🏆</h2>
        
        <div className="leaderboard-list">
          {players.map((player, index) => (
            <div 
              key={index}
              className={`leaderboard-item ${index === 0 ? 'first-place' : ''}`}
            >
              <div className="position">#{index + 1}</div>
              <div className="player-info">
                <span className="name">{player.username}</span>
              </div>
              <div className="elo">{player.skill_points} ELO </div>
              <div className="wins"> |Wins: {player.number_of_wins}</div>
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