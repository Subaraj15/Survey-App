const express = require('express');
const responseController = require('../controllers/responseController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/submit', auth, responseController.submitResponse);
router.get('/survey/:surveyId', auth, responseController.getSurveyResponses);
router.get('/survey/:surveyId/stats', responseController.getSurveyStats);
router.get('/user/my-responses', auth, responseController.getUserResponses);

module.exports = router;
