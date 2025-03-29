import { Link, useParams } from 'react-router-dom';
import { subjectsData } from '../data/subjects';

const TopicsList = () => {
  const { subject, grade } = useParams();
  const topics = subjectsData[subject][grade].topics;

  return (
    <div className="topics-container">
      <h2>{subject.toUpperCase()} - Grade {grade}</h2>
      <div className="topics-grid">
        {Object.entries(topics).map(([topicId, topic]) => (
          <Link 
            key={topicId}
            to={`/learn/${subject}/${grade}/${topicId}`}
            className="topic-card"
          >
            <h3>{topic.title}</h3>
            <p>{topic.tasks.length} challenges</p>
          </Link>
        ))}
      </div>
    </div>
  );
};