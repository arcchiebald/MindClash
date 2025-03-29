import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './TopicDetails.css';

const topicsContent = {
  mathematics: {
    9: [
      {
        title: 'Algebra Basics',
        content: 'Overview of variables, expressions, and simple equations.',
        tasks: ['Solve equation: x + 5 = 12', 'Simplify: 3x + 2x', 'Find the value of x in: 2x = 10']
      },
      // Add additional topics as needed...
    ],
    10: [
      {
        title: 'Quadratic Equations',
        content: 'Learn about solving quadratic equations using the quadratic formula.',
        tasks: ['Solve: x² - 5x + 6 = 0', 'Determine the discriminant of: 2x² + 3x - 2 = 0', 'Graph a quadratic function']
      },
      // More topics...
    ],
    // Similarly for grades 11 and 12...
  },
  english: {
    // Fill with similar structure...
  },
  history: {
    // Fill with similar structure...
  }
};

const TopicDetails = () => {
  const { grade, subject, topicIndex } = useParams();
  const topicList = topicsContent[subject]?.[grade] || [];
  const topic = topicList[topicIndex];

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
      <h1>{topic.title}</h1>
      <p>{topic.content}</p>
      
      <h2>Tasks</h2>
      <ul>
        {topic.tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
      
      <Link to={`/learn/${grade}/${subject}`} className="back-link">
        ← Back to Topics
      </Link>
    </div>
  );
};

export default TopicDetails;
