const Survey = require('../models/Survey');

// Create Survey
exports.createSurvey = async (req, res) => {
    try {
        const { title, description, questions } = req.body;

        if (!title || !questions || questions.length === 0) {
            return res.status(400).json({ message: 'Title and questions are required' });
        }

        const survey = new Survey({
            title,
            description,
            questions,
            creator: req.userId
        });

        await survey.save();
        await survey.populate('creator', 'name email');

        res.status(201).json({
            message: 'Survey created successfully',
            survey
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all surveys
exports.getAllSurveys = async (req, res) => {
    try {
        const surveys = await Survey.find({ isActive: true })
            .populate('creator', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(surveys);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get survey by ID
exports.getSurveyById = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id)
            .populate('creator', 'name email');

        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }

        res.status(200).json(survey);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get surveys created by user
exports.getUserSurveys = async (req, res) => {
    try {
        const surveys = await Survey.find({ creator: req.userId })
            .populate('creator', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(surveys);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Survey
exports.updateSurvey = async (req, res) => {
    try {
        const { title, description, questions, isActive } = req.body;

        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }

        if (survey.creator.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized to update this survey' });
        }

        survey.title = title || survey.title;
        survey.description = description || survey.description;
        survey.questions = questions || survey.questions;
        survey.isActive = isActive !== undefined ? isActive : survey.isActive;
        survey.updatedAt = Date.now();

        await survey.save();
        await survey.populate('creator', 'name email');

        res.status(200).json({
            message: 'Survey updated successfully',
            survey
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete Survey
exports.deleteSurvey = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }

        if (survey.creator.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this survey' });
        }

        await Survey.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: 'Survey deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
