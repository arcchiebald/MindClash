// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Battle from './pages/Battle';
import Login from './pages/Login'; // Add this import
import Learn from './pages/Learn';
import './App.css';
import Signup from './pages/SignUp';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} /> {/* Add this line */}
      
<Route path="/learn" element={<Learn />} />
      </Routes>
    </div>
  );
}

export default App;