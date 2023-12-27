// QuizResultData.js
// This file will store the quiz results data

// Sample initial data
let quizResults = [];

// Function to add quiz result
function addQuizResult(username, score, otherDetails) {
    const quizResult = {
        username,
        score,
        otherDetails,
        timestamp: new Date().toISOString(),
    };
    quizResults.push(quizResult);
    // You can save this data to a server or localStorage for a more permanent solution
}

// Function to get all quiz results
function getAllQuizResults() {
    return quizResults;
}

// Export the functions
export { addQuizResult, getAllQuizResults };
