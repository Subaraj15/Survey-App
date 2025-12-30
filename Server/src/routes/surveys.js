const express = require('express');
const surveyController = require('../controllers/surveyController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, surveyController.createSurvey);
router.get('/', surveyController.getAllSurveys);
router.get('/user/my-surveys', auth, surveyController.getUserSurveys);
router.get('/:id', surveyController.getSurveyById);
router.put('/:id', auth, surveyController.updateSurvey);
router.delete('/:id', auth, surveyController.deleteSurvey);

module.exports = router;
