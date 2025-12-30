import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth endpoints
export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getCurrentUser: () => api.get('/auth/me')
};

// Survey endpoints
export const surveyService = {
    createSurvey: (data) => api.post('/surveys', data),
    getAllSurveys: () => api.get('/surveys'),
    getSurveyById: (id) => api.get(`/surveys/${id}`),
    getUserSurveys: () => api.get('/surveys/user/my-surveys'),
    updateSurvey: (id, data) => api.put(`/surveys/${id}`, data),
    deleteSurvey: (id) => api.delete(`/surveys/${id}`)
};

// Response endpoints
export const responseService = {
    submitResponse: (data) => api.post('/responses/submit', data),
    getSurveyResponses: (surveyId) => api.get(`/responses/survey/${surveyId}`),
    getSurveyStats: (surveyId) => api.get(`/responses/survey/${surveyId}/stats`),
    getUserResponses: () => api.get('/responses/user/my-responses')
};

export default api;
