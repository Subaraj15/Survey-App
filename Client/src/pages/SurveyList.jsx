import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { surveyService } from '../services/api';
import './SurveyList.css';

export const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const res = await surveyService.getAllSurveys();
      setSurveys(res.data);
    } catch (err) {
      setError('Failed to load surveys');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="survey-list-container">Loading...</div>;

  return (
    <div className="survey-list-container">
      <h1>Available Surveys</h1>
      {error && <div className="error-message">{error}</div>}
      {surveys.length === 0 ? (
        <div className="no-surveys">
          <p>No surveys available yet</p>
        </div>
      ) : (
        <div className="surveys-grid">
          {surveys.map((survey) => (
            <div key={survey._id} className="survey-card">
              <h2>{survey.title}</h2>
              <p className="description">{survey.description}</p>
              <div className="survey-info">
                <span>Questions: {survey.questions.length}</span>
                <span>Creator: {survey.creator.name}</span>
              </div>
              <button
                onClick={() => navigate(`/survey/${survey._id}`)}
                className="take-survey-btn"
              >
                Take Survey
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyList;
