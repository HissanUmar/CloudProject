import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import Auth from './components/Auth.jsx'
import SignUpPage from './components/SignUp.jsx';
import HomePage from './pages/HomePage.jsx'
import VideoUploadPage from './pages/VideoUploadPage.jsx'
import VideoStream from './pages/VideoStream.jsx'

function App() {

  const isAuthenticated = () => {
    // Replace this with actual logic to check if the JWT token exists and is valid
    const token = localStorage.getItem('token');
    return token != null;
  };

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/upload" element={<ProtectedRoute element={<VideoUploadPage />} />} />
        <Route path="/stream" element={<ProtectedRoute element={<VideoStream />} />} />
      </Routes>
    </Router>
  );
}

export default App;
