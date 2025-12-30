import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { surveyService, responseService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './TakeSurvey.css';

export const TakeSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchSurvey();
  }, [id]);

  const fetchSurvey = async () => {
    try {
      setLoading(true);
      const res = await surveyService.getSurveyById(id);
      setSurvey(res.data);
      initializeAnswers(res.data.questions);
    } catch (err) {
      setError('Failed to load survey');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initializeAnswers = (questions) => {
    const init = {};
    questions.forEach((q) => {
      init[q._id] = '';
    });
    setAnswers(init);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formattedAnswers = survey.questions.map((question) => ({
        questionId: question._id,
        answer: answers[question._id]
      }));

      await responseService.submitResponse({
        surveyId: id,
        answers: formattedAnswers
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit survey');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="take-survey-container">Loading...</div>;
  if (!survey) return <div className="take-survey-container">Survey not found</div>;

  if (submitSuccess) {
    return (
      <div className="take-survey-container">
        <div className="success-message">
          <h2>Thank you!</h2>
          <p>Your response has been submitted successfully.</p>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="take-survey-container">
      <div className="survey-header">
        <h1>{survey.title}</h1>
        {survey.description && <p className="description">{survey.description}</p>}
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="survey-form">
        {survey.questions.map((question, index) => (
          <div key={question._id} className="question-container">
            <label className="question-text">
              {index + 1}. {question.text}
              {question.required && <span className="required">*</span>}
            </label>

            {question.type === 'multiple-choice' && (
              <div className="options-group">
                {question.options.map((option) => (
                  <label key={option} className="option-label">
                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value={option}
                      checked={answers[question._id] === option}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      required={question.required}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {question.type === 'short-answer' && (
              <input
                type="text"
                value={answers[question._id]}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                placeholder="Your answer"
                required={question.required}
              />
            )}

            {question.type === 'long-answer' && (
              <textarea
                value={answers[question._id]}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                placeholder="Your answer"
                rows="4"
                required={question.required}
              />
            )}

            {question.type === 'rating' && (
              <div className="rating-group">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating} className="rating-label">
                    <input
                      type="radio"
                      name={`rating-${question._id}`}
                      value={rating}
                      checked={answers[question._id] === rating}
                      onChange={(e) => handleAnswerChange(question._id, parseInt(e.target.value))}
                      required={question.required}
                    />
                    {rating}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Survey'}
        </button>
      </form>
    </div>
  );
};

export default TakeSurvey;
