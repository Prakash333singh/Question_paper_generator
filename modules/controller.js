const Questions = require('../Models/questionModel');
const {
    SERVERERROR,
    SUCCESSCODE,
    CLIENTSIDEERROR
} = require('../constants/common');

const controller = {};

controller.addQuestion = async (req, res) => {
    try {
        let question = new Questions(req.body);
        let addedQuestion = await question.save();

        res.status(SUCCESSCODE.CREATED)
            .json({
                message: "Question added successfully",
                status: true,
                question: addedQuestion
            });


    } catch (error) {
        res.status(SERVERERROR.CODE).json({
            errors: { message: error.toString() },
            status: false,
        });
    }
}



controller.generateQuestionPaper = async (req, res) => {
    try {


        // Step-1  define all variables
        const varietyOfEasyMarks = [2, 1];
        const varietyOfMediumMarks = [4, 3, 2, 1];
        const varietyOfHardMarks = [10, 5, 4, 3, 2, 1];
        let arrayOfQuestions = [];

        let numberOfHardQuestion = {
            "10_Marks": 0,
            "5_Marks": 0,
            "4_Marks": 0,
            "3_Marks": 0,
            "2_Marks": 0,
            "1_Marks": 0
        };
        let numberOfMediumQuestion = {
            "4_Marks": 0,
            "3_Marks": 0,
            "2_Marks": 0,
            "1_Marks": 0
        };
        let numberOfEasyQuestion = {
            "2_Marks": 0,
            "1_Marks": 0
        };


        // Step-2 calculate mark by difficulty
        const paperData = req.body;
        let hardPer = paperData.hard;
        let totalMarks = paperData.totalMarks;
        let remainMarks = totalMarks;

        let hardQuestionMarks = Math.floor((hardPer * totalMarks) / 100);
        remainMarks -= hardQuestionMarks;

        let mediumPer = paperData.medium;
        let mediumQuestionMarks = Math.floor((mediumPer * totalMarks) / 100);
        remainMarks -= mediumQuestionMarks;

        let easyQuestionMarks = remainMarks;


        // function which calculates number of questions by difficulty
        function calculateNumberOfQuestion(difficulty, marksByDifficulty) {


            let varietyOfQuestionMarks;
            let numberOfQuestions;
            let questionMarksByVariety;
            let questionMarksByVarietyRemain = marksByDifficulty;
            let loopCount;

            if (difficulty === "Hard") {
                varietyOfQuestionMarks = varietyOfHardMarks;
                numberOfQuestions = numberOfHardQuestion;
                questionMarksByVariety = marksByDifficulty / 3;
                loopCount = 3;
            }
            else if (difficulty === "Medium") {
                varietyOfQuestionMarks = varietyOfMediumMarks;
                numberOfQuestions = numberOfMediumQuestion;
                questionMarksByVariety = marksByDifficulty / 2;
                loopCount = 2;
            }
            else {
                varietyOfQuestionMarks = varietyOfEasyMarks;
                numberOfQuestions = numberOfEasyQuestion;
                questionMarksByVariety = marksByDifficulty / 2;
                loopCount = 1;
            }

            for (let i = 0; i < loopCount; i++) {
                let index = varietyOfQuestionMarks[i] + '_Marks';
                numberOfQuestions[index] = Math.floor(questionMarksByVariety / varietyOfQuestionMarks[i]);
                if (numberOfQuestions[index] !== 0) {
                    questionMarksByVarietyRemain -= (varietyOfQuestionMarks[i] * numberOfQuestions[index]);
                    arrayOfQuestions.push({ difficulty: difficulty, questionMark: varietyOfQuestionMarks[i], numberOfQuestion: numberOfQuestions[index] });
                }

                if (questionMarksByVarietyRemain == 0) {
                    break;
                }
            }
            if (questionMarksByVarietyRemain != 0) {
                for (let i = loopCount; i < varietyOfQuestionMarks.length; i++) {
                    let index = varietyOfQuestionMarks[i] + '_Marks';
                    numberOfQuestions[index] = Math.floor(questionMarksByVarietyRemain / varietyOfQuestionMarks[i]);
                    if (numberOfQuestions[index] !== 0) {
                        questionMarksByVarietyRemain -= (varietyOfQuestionMarks[i] * numberOfQuestions[index]);
                        arrayOfQuestions.push({ difficulty: difficulty, questionMark: varietyOfQuestionMarks[i], numberOfQuestion: numberOfQuestions[index] });
                    }
                    if (questionMarksByVarietyRemain == 0) {
                        break;
                    }
                }
            }

        }


        // calculate number of question for each difficulty 
        calculateNumberOfQuestion("Easy", easyQuestionMarks);
        calculateNumberOfQuestion("Medium", mediumQuestionMarks);
        calculateNumberOfQuestion("Hard", hardQuestionMarks);
        console.log('Easy ::: ', numberOfEasyQuestion)
        console.log('Medium ::: ', numberOfMediumQuestion)
        console.log('Hard ::: ', numberOfHardQuestion)
        console.log(arrayOfQuestions)


        // querying database or fetching questions from database by difficulty
        let myQuestionPaper = [];
        for (let i = 0; i < arrayOfQuestions.length; i++) {
            let query = { difficulty: arrayOfQuestions[i].difficulty, marks: arrayOfQuestions[i].questionMark, $sample: { size: arrayOfQuestions[i].numberOfQuestion } };
            let q = [{ $match: { difficulty: arrayOfQuestions[i].difficulty, marks: arrayOfQuestions[i].questionMark } }, { $sample: { size: arrayOfQuestions[i].numberOfQuestion } }]
            const questions = await Questions.aggregate(q);
            if (questions.length != arrayOfQuestions[i].numberOfQuestion) {
                return res.status(CLIENTSIDEERROR.BADREQUESTCODE)
                    .json({
                        message: "You don't have enough questions in database according your requirement.",
                        status: false,
                    });

            }
            myQuestionPaper.push(questions);
        }

        // console.log(myQuestionPaper);
        res.status(SUCCESSCODE.CREATED)
            .json({
                message: "Question paper generated successfully",
                status: true,
                myQuestionPaper
            });


    } catch (error) {
        res.status(SERVERERROR.CODE).json({
            errors: { message: error.toString() },
            status: false,
        });
    }
}

module.exports = controller;