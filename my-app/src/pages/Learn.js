// src/pages/Learn.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Learn.css';

const Learn = () => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const subjects = [
    { name: 'Mathematics', icon: '🧮' },
    { name: 'English', icon: '📖' },
    { name: 'History', icon: '🌍' },
  ];

  return (
    <div className="learn-container">
      <h1>Choose Your Learning Path</h1>
      
      <div className="grade-selector">
        <label>Select Grade:</label>
        <select 
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
        >
          <option value="">-- Choose Grade --</option>
          {[9, 10, 11, 12].map(grade => (
            <option key={grade} value={grade}>Grade {grade}</option>
          ))}
        </select>
      </div>

      <div className="subjects-grid">
        {subjects.map((subject, index) => (
          <div 
            key={index}
            className="subject-card"
            data-disabled={!selectedGrade}
          >
            <div className="subject-icon">{subject.icon}</div>
            <h3>{subject.name}</h3>
            <button 
              className="start-button"
              disabled={!selectedGrade}
            >
              Start Grade {selectedGrade || '...'}
            </button>
          </div>
        ))}
      </div>

      <Link to="/" className="back-button">
        ← Back to Home
      </Link>
    </div>
  );
};

export default Learn;