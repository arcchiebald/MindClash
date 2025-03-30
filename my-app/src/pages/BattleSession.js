import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BattleSession.css';
import api from '../utils/api';

const BattleSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Properly destructure all the data we need from location.state
  const { 
    battleId, 
    firstQuestion, 
    questions, 
    subject, 
    topics, 
    grade, 
    opponent 
  } = location.state || {};

  const [currentQuestion, setCurrentQuestion] = useState(firstQuestion);
  const [allQuestions, setAllQuestions] = useState(questions || []);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [answer, setAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds per question
  const [animateQuestion, setAnimateQuestion] = useState(false);
  const [playerScore, setPlayerScore] = useState(0); // Track player score but don't display it

  // If we don't have the necessary data, redirect back to battle page
  useEffect(() => {
    if (!battleId || !questions || !opponent) {
      navigate('/battle');
    }
  }, [battleId, questions, opponent, navigate]);

  // Timer effect
  useEffect(() => {
    if (results) return; // Stop timer if results are shown
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleAnswerSubmit();
          return 60; // Reset timer
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [results, questionIndex]);

  // Animation effect when changing questions
  useEffect(() => {
    setAnimateQuestion(true);
    const timeout = setTimeout(() => setAnimateQuestion(false), 500);
    return () => clearTimeout(timeout);
  }, [currentQuestion]);

  const handleAnswerSubmit = () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    // Use the current answer value from state
    const currentAnswer = answer.trim() ? answer : "No answer provided";
    
    api.post(`battle/${battleId}/submit_answer/`, {
      answer: currentAnswer,
      questions: allQuestions,
      current_question_index: questionIndex,
      player_score: playerScore // Include the current cumulative score in JSON
    })
    .then(response => {
      if (response.data.winner) {
        // We've reached the end of the battle
        setResults(response.data);
      } else {
        // Update player score from the response, but don't display it
        if (response.data.player_score !== undefined) {
          setPlayerScore(response.data.player_score);
        }
        
        // Move to the next question
        setCurrentQuestion(response.data.next_question);
        setQuestionIndex(prev => prev + 1);
        setAnswer('');
        setTimeRemaining(60); // Reset timer for next question
      }
    })
    .catch(error => {
      console.error('Error submitting answer:', error);
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleFinish = () => {
    navigate('/');
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get color based on remaining time
  const getTimerColor = () => {
    if (timeRemaining > 30) return '#4CAF50'; // Green
    if (timeRemaining > 10) return '#FFC107'; // Yellow
    return '#FF5252'; // Red
  };

  return (
    <div className="battle-session-container">
      <h1 className="battle-title">Brain Battle</h1>
      
      <div className="players-container">
        <div className="player-card">
          <div className="avatar">👨‍🎓</div>
          <h3>You</h3>
          <div className="subject-badge">{subject} - Grade {grade}</div>
        </div>
        
        <div className="vs">VS</div>
        
        <div className="player-card">
          <div className="avatar">🤖</div>
          <h3>{opponent?.username}</h3>
          <div className="win-stats">
            <span>⭐ {opponent?.skill_points} SP</span> | <span>🏆 {opponent?.number_of_wins} Wins</span>
          </div>
        </div>
      </div>

      <div className="topics-bar">
        {topics && topics.map((topic, index) => (
          <span key={index} className="topic-chip">{topic}</span>
        ))}
      </div>

      {results ? (
        <div className="results-container">
          <div className={`result-card ${results.winner === "draw" ? "draw" : (results.player1_total_score > results.bot_total_score ? "win" : "lose")}`}>
            <h2 className="result-title">Battle Results</h2>
            
            <div className="scores-container">
              <div className="score-box">
                <h3>Your Score</h3>
                <div className="score-value">{results.player1_total_score}</div>
              </div>
              
              <div className="result-badge">
                {results.winner === "draw" ? "DRAW" : 
                  (results.winner === opponent?.username ? "DEFEAT" : "VICTORY")}
              </div>
              
              <div className="score-box">
                <h3>Opponent</h3>
                <div className="score-value">{results.bot_total_score}</div>
              </div>
            </div>
            
            <button onClick={handleFinish} className="finish-button pulse-animation">
              Return to Home
            </button>
          </div>
        </div>
      ) : (
        <div className="question-container">
          <div className="question-header">
            <div className="question-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${(questionIndex / allQuestions.length) * 100}%`}}
                ></div>
              </div>
              <span>Question {questionIndex + 1} of {allQuestions.length}</span>
            </div>
            
            <div 
              className="timer" 
              style={{color: getTimerColor()}}
            >
              <span className={timeRemaining <= 10 ? "pulse" : ""}>⏱️ {formatTime(timeRemaining)}</span>
            </div>
          </div>
          
          <div className={`question-card ${animateQuestion ? 'slide-in' : ''}`}>
            <div className="question-text">{currentQuestion}</div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="answer-input"
            />
            <button
              onClick={handleAnswerSubmit}
              className="submit-button"
              disabled={isSubmitting || !answer.trim()}
            >
              {isSubmitting ? (
                <span className="loading-spinner">⌛</span>
              ) : questionIndex === allQuestions.length - 1 ? (
                'Submit Final Answer'
              ) : (
                'Next Question'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleSession;