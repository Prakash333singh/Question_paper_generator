const express = require('express');
const router = express.Router()

const controller = require('./controller');

router.post("/add-question", controller.addQuestion);

router.post("/generate-question-paper", controller.generateQuestionPaper);

module.exports = router;