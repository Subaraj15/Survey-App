import React, { useState } from 'react';
import { surveyService } from '../services/api';
import './CreateSurvey.css';

export const CreateSurvey = () => {
  const [survey, setSurvey] = useState({
    title: '',
    description: '',
    questions: [
      {
        text: '',
        type: 'multiple-choice',
        options: [''],
        required: true
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSurveyChange = (field, value) => {
    setSurvey({ ...survey, [field]: value });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...survey.questions];
    newQuestions[index][field] = value;
    setSurvey({ ...survey, questions: newQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...survey.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setSurvey({ ...survey, questions: newQuestions });
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...survey.questions];
    newQuestions[questionIndex].options.push('');
    setSurvey({ ...survey, questions: newQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...survey.questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setSurvey({ ...survey, questions: newQuestions });
  };

  const addQuestion = () => {
    setSurvey({
      ...survey,
      questions: [
        ...survey.questions,
        {
          text: '',
          type: 'multiple-choice',
          options: [''],
          required: true
        }
      ]
    });
  };

  const removeQuestion = (index) => {
    setSurvey({
      ...survey,
      questions: survey.questions.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Validate survey
      if (!survey.title.trim()) {
        throw new Error('Survey title is required');
      }
      if (survey.questions.some((q) => !q.text.trim())) {
        throw new Error('All questions must have text');
      }
      if (
        survey.questions.some(
          (q) =>
            q.type === 'multiple-choice' &&
            q.options.some((o) => !o.trim())
        )
      ) {
        throw new Error('All options must be filled');
      }

      await surveyService.createSurvey(survey);
      setMessage('Survey created successfully!');
      setSurvey({
        title: '',
        description: '',
        questions: [
          {
            text: '',
            type: 'multiple-choice',
            options: [''],
            required: true
          }
        ]
      });
    } catch (err) {
      setMessage(err.message || 'Failed to create survey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-survey-container">
      <h1>Create a New Survey</h1>
      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Survey Title *</label>
          <input
            type="text"
            value={survey.title}
            onChange={(e) => handleSurveyChange('title', e.target.value)}
            placeholder="Enter survey title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={survey.description}
            onChange={(e) => handleSurveyChange('description', e.target.value)}
            placeholder="Enter survey description (optional)"
            rows="3"
          />
        </div>

        <div className="questions-section">
          <h2>Questions</h2>
          {survey.questions.map((question, qIndex) => (
            <div key={qIndex} className="question-box">
              <div className="form-group">
                <label>Question {qIndex + 1} *</label>
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                  placeholder="Enter question text"
                  required
                />
              </div>

              <div className="form-group">
                <label>Question Type</label>
                <select
                  value={question.type}
                  onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="short-answer">Short Answer</option>
                  <option value="long-answer">Long Answer</option>
                  <option value="rating">Rating (1-5)</option>
                </select>
              </div>

              {question.type === 'multiple-choice' && (
                <div className="options-section">
                  <label>Options</label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="option-input">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        placeholder={`Option ${oIndex + 1}`}
                      />
                      {question.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="add-option-btn"
                  >
                    + Add Option
                  </button>
                </div>
              )}

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, 'required', e.target.checked)
                    }
                  />
                  Required
                </label>
              </div>

              {survey.questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="remove-question-btn"
                >
                  Remove Question
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addQuestion} className="add-question-btn">
            + Add Question
          </button>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Survey'}
        </button>
      </form>
    </div>
  );
};

export default CreateSurvey;
