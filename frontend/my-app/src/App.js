// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Battle from './pages/Battle';
import Login from './pages/Login'; 
import Learn from './pages/Learn';
import Leaderboard from './pages/Leaderboard'; // New import
import './App.css';
import Signup from './pages/SignUp';
import SubjectTopics from './pages/SubjectTopics';
import TopicDetails from './pages/TopicDetails';
import BattleSession from './pages/BattleSession';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/battle/session" element={<BattleSession />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/leaderboard" element={<Leaderboard />} /> {/* New route */}
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:grade/:subject" element={<SubjectTopics />} />
        <Route path="/learn/:grade/:subject/:topicIndex" element={<TopicDetails />} />
      </Routes>
    </div>
  );
}

export default App;