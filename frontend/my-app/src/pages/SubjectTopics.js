// src/pages/SubjectTopics.js
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './SubjectTopics.css';

const topicsData = {
  mathematics: {
    9: ['Algebra Basics', 'Geometry Fundamentals', 'Linear Equations'],
    10: ['Quadratic Equations', 'Trigonometry', 'Probability'],
    11: ['Calculus I', 'Complex Numbers', 'Statistics'],
    12: ['Calculus II', 'Vectors & Matrices', 'Differential Equations']
  },
  english: {
    9: ['Grammar Review', 'Literary Analysis', 'Writing Skills'],
    10: ['Poetry Study', 'Essay Writing', 'Reading Comprehension'],
    11: ['Shakespeare', 'Advanced Writing', 'Research Papers'],
    12: ['Public Speaking', 'Creative Writing', 'Modern Literature']
  },
  history: {
    9: ['Ancient Civilizations', 'Medieval Europe', 'World Wars'],
    10: ['The Renaissance', 'Industrial Revolution', 'Cold War'],
    11: ['US History', 'European History', 'Political Movements'],
    12: ['Modern Conflicts', 'International Relations', 'Economic History']
  }
};

const SubjectTopics = () => {
  const { grade, subject } = useParams();
  const navigate = useNavigate();
  const topics = topicsData[subject]?.[grade] || [];

  const handleTopicSelect = (topicIndex) => {
    // Navigate to the topic details page
    navigate(`/learn/${grade}/${subject}/${topicIndex}`);
  };

  return (
    <div className="topics-container">
      <h1>{subject.charAt(0).toUpperCase() + subject.slice(1)} - Grade {grade}</h1>
      <h2>Topics</h2>
      <ul>
        {topics.length > 0 ? (
          topics.map((topic, index) => (
            <li key={index}>
              <button onClick={() => handleTopicSelect(index)}>
                {topic}
              </button>
            </li>
          ))
        ) : (
          <p>No topics found.</p>
        )}
      </ul>
      <Link to="/learn" className="back-link">← Back to Learning Paths</Link>
    </div>
  );
};

export default SubjectTopics;
