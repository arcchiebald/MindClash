// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';  // Add axios import
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Make actual API call to Django backend
      const response = await axios.post(
        `http://127.0.0.1:8000/api/login/`,  // Use environment variable
        {
          email: email,
          password: password
        }
      );

      // 2. Store received token in localStorage
      localStorage.setItem('authToken', response.data.token);
      
      // 3. Clear form fields
      setEmail('');
      setPassword('');
      
      // 4. Redirect to home page
      navigate('/');

    } catch (err) {
      // Handle different error types
      if (err.response) {
        // Backend returned error response (4xx/5xx status)
        setError(err.response.data.error || 'Invalid email or password');
      } else if (err.request) {
        // No response received
        setError('Server is not responding. Please try again later.');
      } else {
        // Other errors
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome to MindClash! ⚔️</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@studybattle.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="login-links">
          <Link to="/signup" className="link">Create Account</Link>
          <Link to="/forgot-password" className="link">Forgot Password?</Link>
          <Link to="/" className="back-button">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;