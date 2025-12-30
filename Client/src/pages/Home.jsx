import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Welcome to Survey App</h1>
        <p>Create surveys, collect feedback, and analyze results</p>
      </div>

      <div className="actions-grid">
        <div className="action-card">
          <h2>📋 Create Survey</h2>
          <p>Design and publish surveys to gather feedback from your audience</p>
          <button onClick={() => navigate('/create-survey')} className="action-btn">
            Create New Survey
          </button>
        </div>

        <div className="action-card">
          <h2>📝 Take Survey</h2>
          <p>Fill out surveys and share your feedback</p>
          <button onClick={() => navigate('/surveys')} className="action-btn">
            Browse Surveys
          </button>
        </div>

        <div className="action-card">
          <h2>📊 View Results</h2>
          <p>Track responses and analyze survey results with charts</p>
          <button onClick={() => navigate('/my-surveys')} className="action-btn">
            My Surveys
          </button>
        </div>
      </div>

      {user && (
        <div className="user-welcome">
          <p>Hello, {user.name}! 👋</p>
        </div>
      )}
    </div>
  );
};

export default Home;
