import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './TopicDetails.css';

const topicsContent = {
  mathematics: {
    9: [
      {
        title: 'Algebra Basics',
        content: 'Overview of variables, expressions, and simple equations.',
        tasks: [ {
          question: 'Solve equation: x + 5 = 12',
          answer: '7',
          type: 'text',
          explanation: 'Subtract 5 from both sides: x + 5 - 5 = 12 - 5 → x = 7'
        },
        {
          question: 'Simplify: 3x + 2x',
          answer: '5x',
          type: 'text',
          explanation: 'Combine like terms: 3x + 2x = (3+2)x = 5x'
        },
        {
          question: 'Find the value of x in: 2x = 10',
          answer: '5',
          type: 'mcq',
          options: ['3', '5', '7'],
          explanation: 'Divide both sides by 2: 2x/2 = 10/2 → x = 5'
        }
      ]
      },
      {
        title: 'Geometry Fundamentals', 
        content: 'Basic concepts of points, lines, angles, and shapes.',
        tasks: [{
          question: 'What is the sum of interior angles in a triangle?',
          answer: '180°',
          type: 'mcq',
          options: ['90°', '180°', '360°'],
          explanation: 'The sum of interior angles in any triangle always equals 180 degrees.'
        },
        {
          question: 'How many sides does a quadrilateral have?',
          answer: '4',
          type: 'mcq',
          options: ['3', '4', '5'],
          explanation: 'Quadrilaterals are four-sided polygons (quad = four, lateral = side).'
        },
        {
          question: 'Calculate the area of a rectangle with length 5cm and width 3cm',
          answer: '15',
          type: 'text',
          explanation: 'Area = length × width = 5cm × 3cm = 15cm²'
        },
        {
          question: 'What type of angle is 95°?',
          answer: 'Obtuse',
          type: 'mcq',
          options: ['Acute', 'Right', 'Obtuse', 'Straight'],
          explanation: 'Angles between 90° and 180° are called obtuse angles.'
        }
      ]
      },
      {
        title: 'Linear Equations',
        content: 'Solving equations with variables and graphing linear functions.',
        tasks: [ {
          question: 'Solve for y: 2y - 4 = 10',
          answer: '7',
          type: 'text',
          explanation: 'Add 4 to both sides: 2y = 14 → Divide by 2: y = 7'
        },
        {
          question: 'What is the slope of y = 3x + 2?',
          answer: '3',
          type: 'mcq',
          options: ['2', '3', '5'],
          explanation: 'In y = mx + b form, m represents the slope (coefficient of x).'
        },
        {
          question: 'Find the x-intercept of 2x + 3y = 6',
          answer: '3',
          type: 'text',
          explanation: 'Set y=0: 2x = 6 → x = 3'
        },
        {
          question: 'Which equation represents a vertical line?',
          answer: 'x = 5',
          type: 'mcq',
          options: ['y = 2x + 1', 'x = 5', 'y = -3', '2x + 3y = 6'],
          explanation: 'Vertical lines have equations of form x = constant.'
        },
        {
          question: 'Solve the system: x + y = 5 and x - y = 1',
          answer: 'x=3, y=2',
          type: 'text',
          explanation: 'Add the equations: 2x = 6 → x=3. Substitute: 3 + y = 5 → y=2'
        }
      ]
    }
      ],
      

    10: [
      {
        title: 'Quadratic Equations',
        content: 'Learn to solve second-degree polynomial equations using factoring, quadratic formula, and graphing. Understand discriminant analysis and real-world applications.',
        tasks: [
          {
            question: 'Solve x² - 5x + 6 = 0',
            answer: 'x=2, x=3',
            type: 'text',
            explanation: 'Factor: (x-2)(x-3)=0 → Solutions at x=2 and x=3'
          },
          {
            question: 'What is the discriminant of 2x² + 3x - 2 = 0?',
            answer: '25',
            type: 'mcq',
            options: ['17', '25', '-25'],
            explanation: 'Discriminant = b² - 4ac = 9 + 16 = 25'
          },
          {
            question: 'Which method is best for solving x² + 6x + 9 = 0?',
            answer: 'Factoring',
            type: 'mcq',
            options: ['Quadratic Formula', 'Factoring', 'Graphing'],
            explanation: 'Perfect square trinomial: (x+3)² = 0'
          }
        ]
      },
      {
        title: 'Trigonometry',
        content: 'Study of triangle relationships using sine, cosine, and tangent. Learn unit circle values and solve real-world problems using trigonometric ratios.',
        tasks: [
          {
            question: 'What is sin(45°)?',
            answer: '√2/2',
            type: 'mcq',
            options: ['1/2', '√3/2', '√2/2'],
            explanation: 'Standard unit circle value for 45° angle'
          },
          {
            question: 'Calculate tan(θ) when opposite=3, adjacent=4',
            answer: '0.75',
            type: 'text',
            explanation: 'tanθ = opposite/adjacent = 3/4 = 0.75'
          }
        ]
      },
      {
        title: 'Probability',
        content: 'Understand basic probability concepts, combinations, permutations, and calculate likelihoods of independent/dependent events.',
        tasks: [
          {
            question: 'Probability of getting heads in coin toss?',
            answer: '0.5',
            type: 'mcq',
            options: ['0.25', '0.5', '0.75'],
            explanation: 'Two possible outcomes, one favorable'
          }
        ]
      }
    ],
    11: [
      {
        title: 'Calculus I',
        content: 'Introduction to limits and derivatives.',
        tasks: []
      },
      {
        title: 'Complex Numbers',
        content: 'Working with numbers in the form a + bi.',
        tasks: []
      },
      {
        title: 'Statistics',
        content: 'Data analysis and interpretation methods.',
        tasks: []
      }
    ],
    12: [
      {
        title: 'Calculus II',
        content: 'Integration techniques and applications.',
        tasks: []
      },
      {
        title: 'Vectors & Matrices',
        content: 'Introduction to linear algebra concepts.',
        tasks: []
      },
      {
        title: 'Differential Equations',
        content: 'Equations involving derivatives and their solutions.',
        tasks: []
      }
    ]
  },
  english: {
    9: [
      {
        title: 'Grammar Review',
        content: 'Refreshing essential grammar rules and structures.',
        tasks: []
      },
      {
        title: 'Literary Analysis',
        content: 'Analyzing texts and understanding literary devices.',
        tasks: []
      },
      {
        title: 'Writing Skills',
        content: 'Developing clear and effective writing techniques.',
        tasks: []
      }
    ],
    // Add other grades for English...
  },
  history: {
    9: [
      {
        title: 'Ancient Civilizations',
        content: 'Study of early human societies and cultures.',
        tasks: []
      },
      {
        title: 'Medieval Europe',
        content: 'Understanding the Middle Ages in European history.',
        tasks: []
      },
      {
        title: 'World Wars',
        content: 'Comprehensive study of 20th century global conflicts.',
        tasks: []
      }
    ],
    // Add other grades for History...
  }
};

const TopicDetails = () => {
  const { grade, subject, topicIndex } = useParams();
  const numericGrade = parseInt(grade);
  const numericIndex = parseInt(topicIndex);
  
  const topicList = topicsContent[subject]?.[numericGrade] || [];
  const topic = topicList[numericIndex];
  const [userAnswers, setUserAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);

  const handleAnswerChange = (taskIndex, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [taskIndex]: value
    }));
  };

  const checkAnswers = () => {
    setShowAnswers(true);
  };

  if (!topic) {
    return (
      <div className="topic-details-container">
        <h1>Topic Not Found</h1>
        <Link to={`/learn/${grade}/${subject}`} className="back-link">
          ← Back to Topics
        </Link>
      </div>
    );
  }

  return (
    <div className="topic-details-container">
      <div className="topic-header">
        <h1>{topic.title}</h1>
        <Link to={`/learn/${grade}/${subject}`} className="back-link">
          ← Back to Topics
        </Link>
      </div>
      
      <div className="content-section">
        <h2>Lesson Content</h2>
        <p>{topic.content}</p>
      </div>

      <div className="tasks-section">
        <h2>Practice Exercises</h2>
        {topic.tasks.map((task, index) => (
          <div key={index} className="task-card">
            <h3>Exercise {index + 1}</h3>
            <p>{task.question}</p>
            
            {task.type === 'mcq' ? (
              <div className="options-grid">
                {task.options.map((option, optIndex) => (
                  <button
                    key={optIndex}
                    className={`option-button 
                      ${userAnswers[index] === option ? 'selected' : ''}
                      ${showAnswers && option === task.answer ? 'correct' : ''}
                      ${showAnswers && userAnswers[index] === option && option !== task.answer ? 'incorrect' : ''}
                    `}
                    onClick={() => !showAnswers && handleAnswerChange(index, option)}
                    disabled={showAnswers}
                  >
                    {option}
                    {userAnswers[index] === option && !showAnswers && (
                      <span className="selection-indicator">✓</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={userAnswers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="answer-input"
                placeholder="Your answer..."
                disabled={showAnswers}
              />
            )}

            {showAnswers && (
              <div className="answer-feedback">
                <span className="correct-answer">
                  Correct answer: {task.answer}
                </span>
                {userAnswers[index] === task.answer ? (
                  <span className="correct">✓ Correct!</span>
                ) : (
                  <span className="incorrect">✗ Try again!</span>
                )}
                {task.explanation && (
                  <p className="explanation">{task.explanation}</p>
                )}
              </div>
            )}
          </div>
        ))}

        <button 
          className="submit-button"
          onClick={checkAnswers}
          disabled={Object.keys(userAnswers).length !== topic.tasks.length}
        >
          Check Answers
        </button>
      </div>
    </div>
  );
};

export default TopicDetails;