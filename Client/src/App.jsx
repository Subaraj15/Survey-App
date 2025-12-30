import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateSurvey from './pages/CreateSurvey';
import SurveyList from './pages/SurveyList';
import TakeSurvey from './pages/TakeSurvey';
import MySurveys from './pages/MySurveys';
import SurveyResults from './pages/SurveyResults';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/create-survey"
            element={
              <ProtectedRoute>
                <CreateSurvey />
              </ProtectedRoute>
            }
          />
          <Route path="/surveys" element={<SurveyList />} />
          <Route path="/survey/:id" element={<TakeSurvey />} />
          <Route
            path="/my-surveys"
            element={
              <ProtectedRoute>
                <MySurveys />
              </ProtectedRoute>
            }
          />
          <Route
            path="/survey-results/:id"
            element={
              <ProtectedRoute>
                <SurveyResults />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
