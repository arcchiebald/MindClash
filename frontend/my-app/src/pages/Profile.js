// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Use the centralized axios instance
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [localGrade, setLocalGrade] = useState(10);

  // Fetch user data with proper auth headers
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    // Redirect if no token
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.get(`http://127.0.0.1:8000/api/user/`);
        
        // Map backend response to frontend structure
        const userData = response.data;
        setProfile({
          username: userData.username,
          email: userData.email,
          birthday: userData.birthday,
          age: userData.age,
          bio: userData.profile.bio,
          location: userData.profile.location || 'Not specified',
          grade: userData.student_profile.grade,
          skillLevel: userData.student_profile.skill_points,
          wins: userData.student_profile.number_of_wins,
          crowns: userData.student_profile.number_of_wins,
          avatar: '🧑💻'
        });
        setLocalGrade(userData.student_profile.grade);

      } catch (error) {
        handleFetchError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle different error types
  const handleFetchError = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        setError('Session expired - Please login again');
        localStorage.removeItem('authToken');
        navigate('/login');
      } else {
        setError('Failed to load profile data');
      }
    } else if (error.request) {
      setError('Server is not responding');
    } else {
      setError('Unknown error occurred');
    }
  };

  // Update grade on backend
  const updateGrade = async () => {
    try {
      const newGrade = prompt('Enter your new grade (9-12):', localGrade);
      
      // Validate input
      if (!newGrade || isNaN(newGrade) || newGrade < 9 || newGrade > 12) {
        setError('Please enter a valid grade between 9 and 12');
        return;
      }
  
      // Convert to number and update
      const numericGrade = parseInt(newGrade);
      
      // Use the new API endpoint with PUT method
      const response = await api.put(`/update-grade/`, { 
        grade: numericGrade
      });
  
      // Verify backend returns updated data
      if (response.data.grade) {
        setLocalGrade(numericGrade);
        setProfile(prev => ({
          ...prev,
          grade: numericGrade
        }));
        setError('');
      } else {
        setError('Grade update failed - invalid response from server');
      }
  
    } catch (error) {
      console.error('Grade update error:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to update grade');
    }
  };

  // Loading and error states
  if (isLoading) return <div className="loading">🔍 Loading profile...</div>;
  if (error) return <div className="error">⚠️ {error}</div>;
  if (!profile) return <div className="error">❌ No profile data found</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{profile.avatar}</div>
          <h2>{profile.username}</h2>
        </div>

        <div className="profile-details">
          <div className="stat-item">
            <span className="stat-label">Email:</span>
            <span className="detail-value">{profile.email}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Age:</span>
            <span className="detail-value">{profile.age}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Bio:</span>
            <span className="detail-value">{profile.bio}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Location:</span>
            <span className="detail-value">{profile.location}</span>
          </div>
        </div>

        <div className="profile-stats">
          {/* Grade Selector */}
      
<div className="form-group">
  <span className="stat-label">Grade</span>
  <div className="grade-display">
    <span>Current Grade: {localGrade}</span>
    <button 
      onClick={() => updateGrade()}
      className="signup-button"
      style={{ 
        marginTop: '0.5rem',
        padding: '0.5rem 1rem',
        fontSize: '0.9rem'
      }}
    >
      Change Grade
    </button>
  </div>
</div>

          {/* Skill Level Progress */}
          <div className="stat-item">
            <span className="stat-label">📈 Learning Progress</span>
            <div className="skill-meter">
              <div 
                className="skill-progress" 
                style={{ width: `${Math.min(profile.skillLevel/100, 100)}%` }}
              >
                {Math.min(profile.skillLevel/100, 100)}%
              </div>
            </div>
          </div>

          {/* Wins Counter */}
          <div className="stat-item">
            <span className="stat-label">🏆 Clash Wins</span>
            <div className="wins-counter">
              {profile.wins}
            </div>
          </div>

        </div>

        <Link to="/" className="back-button">
          ← Back to Home
        </Link>
        <button 
          onClick={() => {
            localStorage.removeItem('authToken');
            navigate('/login');
          }}
          className="logout-button"
          style={{ 
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#ff4d4d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;