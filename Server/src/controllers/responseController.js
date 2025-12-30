const Response = require('../models/Response');
const Survey = require('../models/Survey');

// Submit Survey Response
exports.submitResponse = async (req, res) => {
    try {
        const { surveyId, answers } = req.body;

        if (!surveyId || !answers || answers.length === 0) {
            return res.status(400).json({ message: 'Survey ID and answers are required' });
        }

        const survey = await Survey.findById(surveyId);
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }

        const response = new Response({
            survey: surveyId,
            respondent: req.userId || null,
            answers
        });

        await response.save();
        await response.populate('survey', 'title');
        await response.populate('respondent', 'name email');

        res.status(201).json({
            message: 'Response submitted successfully',
            response
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get responses for a survey
exports.getSurveyResponses = async (req, res) => {
    try {
        const { surveyId } = req.params;

        const survey = await Survey.findById(surveyId);
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }

        // Check if user is the creator of the survey
        if (survey.creator.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized to view responses' });
        }

        const responses = await Response.find({ survey: surveyId })
            .populate('respondent', 'name email')
            .sort({ submittedAt: -1 });

        res.status(200).json(responses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get survey statistics
exports.getSurveyStats = async (req, res) => {
    try {
        const { surveyId } = req.params;

        const survey = await Survey.findById(surveyId);
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }

        const responses = await Response.find({ survey: surveyId });
        const totalResponses = responses.length;

        const stats = {
            totalResponses,
            survey: {
                id: survey._id,
                title: survey.title,
                totalQuestions: survey.questions.length
            },
            questionStats: survey.questions.map((question) => {
                const questionAnswers = responses
                    .map((response) => {
                        const answer = response.answers.find(
                            (a) => a.questionId.toString() === question._id.toString()
                        );
                        return answer?.answer;
                    })
                    .filter((a) => a !== undefined);

                let answerBreakdown = {};
                if (question.type === 'multiple-choice') {
                    question.options.forEach((option) => {
                        answerBreakdown[option] = questionAnswers.filter(
                            (a) => a === option
                        ).length;
                    });
                } else if (question.type === 'rating') {
                    for (let i = 1; i <= 5; i++) {
                        answerBreakdown[i] = questionAnswers.filter((a) => a === i).length;
                    }
                }

                return {
                    questionId: question._id,
                    questionText: question.text,
                    questionType: question.type,
                    totalAnswers: questionAnswers.length,
                    answerBreakdown:
                        Object.keys(answerBreakdown).length > 0 ? answerBreakdown : null
                };
            })
        };

        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all responses by user
exports.getUserResponses = async (req, res) => {
    try {
        const responses = await Response.find({ respondent: req.userId })
            .populate('survey', 'title description')
            .sort({ submittedAt: -1 });

        res.status(200).json(responses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
