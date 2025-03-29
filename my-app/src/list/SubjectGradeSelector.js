import { Link } from 'react-router-dom';
import { subjectsData } from '../data/subjects';

const SubjectGradeSelector = () => {
  const subjects = Object.keys(subjectsData);
  const grades = [9, 10, 11, 12];

  return (
    <div className="selection-container">
      <h2 className="battle-title">Choose Your Battle!</h2>
      
      <div className="subject-grid">
        {subjects.map(subject => (
          <div key={subject} className="subject-card">
            <h3>{subject.charAt(0).toUpperCase() + subject.slice(1)}</h3>
            <div className="grade-buttons">
              {grades.map(grade => (
                subjectsData[subject][grade] ? (
                  <Link 
                    to={`/learn/${subject}/${grade}`}
                    key={grade}
                    className="grade-button"
                  >
                    Grade {grade}
                  </Link>
                ) : (
                  <button 
                    key={grade} 
                    className="grade-button disabled"
                    disabled
                  >
                    Coming Soon
                  </button>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectGradeSelector;