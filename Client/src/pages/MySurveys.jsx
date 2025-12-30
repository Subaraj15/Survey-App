import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { surveyService } from '../services/api';
import './MySurveys.css';

export const MySurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserSurveys();
  }, []);

  const fetchUserSurveys = async () => {
    try {
      setLoading(true);
      const res = await surveyService.getUserSurveys();
      setSurveys(res.data);
    } catch (err) {
      setError('Failed to load surveys');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (surveyId) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await surveyService.deleteSurvey(surveyId);
        setSurveys(surveys.filter((s) => s._id !== surveyId));
      } catch (err) {
        setError('Failed to delete survey');
      }
    }
  };

  if (loading) return <div className="my-surveys-container">Loading...</div>;

  return (
    <div className="my-surveys-container">
      <div className="header">
        <h1>My Surveys</h1>
        <button onClick={() => navigate('/create-survey')} className="create-btn">
          + Create New Survey
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {surveys.length === 0 ? (
        <div className="no-surveys">
          <p>No surveys yet. Create your first survey!</p>
          <button onClick={() => navigate('/create-survey')} className="create-btn">
            Create Survey
          </button>
        </div>
      ) : (
        <div className="surveys-table">
          <div className="table-header">
            <div>Title</div>
            <div>Questions</div>
            <div>Status</div>
            <div>Created</div>
            <div>Actions</div>
          </div>
          {surveys.map((survey) => (
            <div key={survey._id} className="table-row">
              <div className="title">{survey.title}</div>
              <div>{survey.questions.length}</div>
              <div>
                <span className={`status ${survey.isActive ? 'active' : 'inactive'}`}>
                  {survey.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>{new Date(survey.createdAt).toLocaleDateString()}</div>
              <div className="actions">
                <button
                  onClick={() => navigate(`/survey-results/${survey._id}`)}
                  className="view-btn"
                  title="View Results"
                >
                  📊
                </button>
                <button
                  onClick={() => navigate(`/survey/${survey._id}`)}
                  className="edit-btn"
                  title="Take Survey"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(survey._id)}
                  className="delete-btn"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySurveys;
