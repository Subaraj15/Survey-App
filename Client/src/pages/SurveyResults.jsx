import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { responseService, surveyService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Bar, Doughnut, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import './SurveyResults.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const SurveyResults = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [survey, setSurvey] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResultsData();
  }, [id]);

  const fetchResultsData = async () => {
    try {
      setLoading(true);
      const surveyRes = await surveyService.getSurveyById(id);
      setSurvey(surveyRes.data);

      const statsRes = await responseService.getSurveyStats(id);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to load results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="results-container">Loading...</div>;
  if (!survey) return <div className="results-container">Survey not found</div>;

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>{survey.title}</h1>
        {survey.description && <p className="description">{survey.description}</p>}
        {stats && (
          <div className="stats-summary">
            <div className="stat-item">
              <h3>{stats.totalResponses}</h3>
              <p>Total Responses</p>
            </div>
            <div className="stat-item">
              <h3>{survey.questions.length}</h3>
              <p>Questions</p>
            </div>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {stats && (
        <div className="results-content">
          {stats.questionStats.map((question, index) => (
            <div key={question.questionId} className="question-result">
              <h2>
                Question {index + 1}: {question.questionText}
              </h2>
              <p className="question-type">Type: {question.questionType}</p>
              <p className="total-answers">
                Responses: {question.totalAnswers} / {stats.totalResponses}
              </p>

              {question.answerBreakdown && (
                <div className="chart-container">
                  {question.questionType === 'multiple-choice' && (
                    <Doughnut
                      data={{
                        labels: Object.keys(question.answerBreakdown),
                        datasets: [
                          {
                            data: Object.values(question.answerBreakdown),
                            backgroundColor: [
                              '#667eea',
                              '#764ba2',
                              '#f093fb',
                              '#4facfe',
                              '#00f2fe'
                            ],
                            borderColor: '#fff',
                            borderWidth: 2
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  )}

                  {question.questionType === 'rating' && (
                    <Bar
                      data={{
                        labels: Object.keys(question.answerBreakdown).map((k) => `${k} ⭐`),
                        datasets: [
                          {
                            label: 'Number of Responses',
                            data: Object.values(question.answerBreakdown),
                            backgroundColor: '#667eea',
                            borderRadius: 5
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: {
                            display: true
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }}
                    />
                  )}
                </div>
              )}

              {question.questionType === 'short-answer' ||
                (question.questionType === 'long-answer' && (
                  <div className="text-answers">
                    <p>Text answers cannot be displayed in a chart.</p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyResults;
