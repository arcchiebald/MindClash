// src/pages/Battle.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Battle.css';
import api from '../utils/api';

const Battle = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [foundOpponent, setFoundOpponent] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('subjects/')
      .then(response => {
        setSubjects(response.data);
        if (response.data.length > 0) {
          setSelectedSubject(response.data[0].id); // Use subject ID
        }
      })
      .catch(error => {
        console.error('Error fetching subjects:', error);
      });
  }, []);

  const handleReadyClick = () => {
    if (!isSearching && !foundOpponent) {
      setIsSearching(true);

      api.post('battle/initiate_battle/', {
        subject_id: selectedSubject
      })
      .then(response => {
        const { 
          battle_id, 
          questions, 
          opponent, 
          subject, 
          topics, 
          grade 
        } = response.data;
        
        setFoundOpponent(opponent);
        startCountdown(battle_id, questions, opponent, subject, topics, grade);
      })
      .catch(error => {
        console.error('Error initiating battle:', error);
        setIsSearching(false);
      });
    }
  };

  const startCountdown = (battleId, questions, opponent, subject, topics, grade) => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/battle/session', {
            state: {
              battleId,
              firstQuestion: questions[0],
              questions: questions,
              opponent,
              subject: subject,
              topics: topics,
              grade: grade
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
    const selectedId = parseInt(e.target.value, 10); // Ensure the value is parsed as a number
    setSelectedSubject(selectedId);
  };

  return (
    <div className="battle-container">
      <Link to="/" className="logo-section">
        <h1 className="logo">MindClash</h1>
        <p className="tagline">Learn. Compete. Excel.</p>
      </Link>

      <div className="subject-select-container">
        <label htmlFor="subject">Choose Subject:</label>
        <select
          id="subject"
          value={selectedSubject}
          onChange={handleSubjectChange}
          className="subject-select"
        >
          {subjects.map(subject => (
            <option key={subject.id} value={subject.id}>{subject.name}</option>
          ))}
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
              <div className="battle-avatar">{foundOpponent.avatar || '🤖'}</div>
              <h3>{foundOpponent.username}</h3>
              <p>Skill Points: {foundOpponent.skill_points}</p>
              <div className="win-stats">🏆 {foundOpponent.number_of_wins} Wins</div>
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