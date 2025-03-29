import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './BattleSession.css';

const BattleSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, opponent, subject, grade } = location.state || {};
  
  // State management
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch questions from Django backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject,
            grade,
            num_questions: 10
          }),
        });
        
        if (!response.ok) throw new Error('Failed to fetch questions');
        
        const data = await response.json();
        setQuestions(data.questions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        navigate('/battle', { state: { error: 'Failed to load questions' } });
      }
    };

    if (subject && grade) fetchQuestions();
  }, [subject, grade, navigate]);

  // Timer system
  useEffect(() => {
    if (!isLoading && currentQuestionIndex < questions.length) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswerSubmit(''); // Submit empty answer if time runs out
            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, isLoading, questions.length]);

  const handleAnswerSubmit = (answer) => {
    setIsSubmitting(true);
    setUserAnswers([...userAnswers, {
      question_id: questions[currentQuestionIndex].id,
      answer_text: answer
    }]);
    setCurrentAnswer('');
    setIsSubmitting(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(60);
    } else {
      finishBattle();
    }
  };

  const finishBattle = async () => {
    setIsFinished(true);
    try {
      const response = await fetch('/api/submit-answers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          opponent_id: opponent.id,
          answers: userAnswers
        }),
      });

      const result = await response.json();
      navigate('/battle-result', { state: { result } });
    } catch (error) {
      console.error('Error submitting answers:', error);
      navigate('/battle', { state: { error: 'Failed to submit answers' } });
    }
  };

  if (!opponent) {
    return (
      <div className="battle-session-container">
        <h2>Error: No opponent data received</h2>
        <Link to="/battle" className="back-button">
          ← Back to Matchmaking
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="battle-session-container">Loading questions...</div>;
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

      {/* Question Interface */}
      {questions.length > 0 && !isFinished && (
        <div className="question-container">
          <div className="question-header">
            <span>Question {currentQuestionIndex + 1} of 10</span>
            <div className="timer">Time left: {timeLeft}s</div>
          </div>
          
          <div className="question-card">
            <h3>{questions[currentQuestionIndex].question_text}</h3>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
            />
            <button 
              className="submit-button"
              onClick={() => handleAnswerSubmit(currentAnswer)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleSession;