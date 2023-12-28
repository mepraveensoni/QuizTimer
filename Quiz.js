let currentQuestion = 0;
let score = 0;
const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');

let quizStartTime;
let quizEndTime;
let timerInterval;
let currentUsername;
let currentRollNumber;


function startQuiz() {
    const usernameInput = document.getElementById('username');
    const rollNumberInput = document.getElementById('rollNumber');

    if (!usernameInput || !rollNumberInput) {
        console.error('Username or Roll Number input not found.');
        return;
    }

    const username = usernameInput.value;
    const rollNumber = rollNumberInput.value;

    // Check if both username and roll number are provided
    if (username.trim() === '' || rollNumber.trim() === '') {
        // alert('Please enter both your username and roll number before starting the quiz.');
        return;
    }

    // Store the username and roll number in localStorage and variables
    localStorage.setItem('username', username);
    localStorage.setItem('rollNumber', rollNumber);
    currentUsername = username;
    currentRollNumber = rollNumber;

    // Check if the quiz is already in progress
    if (!checkQuizState()) {
        // If not, shuffle questions and options
        shuffleQuestions();

        quizStartTime = new Date();
        currentQuestion++;
        showQuestion();
    }
}

function checkQuizState() {
    const storedQuestion = localStorage.getItem('currentQuestion');
    const storedScore = localStorage.getItem('score');
    const storedTimeTaken = localStorage.getItem('timeTaken');
    const storedUsername = localStorage.getItem('username');
    const storedRollNumber = localStorage.getItem('rollNumber');

    if (
        storedQuestion !== null &&
        storedScore !== null &&
        storedTimeTaken !== null &&
        storedUsername !== null &&
        storedRollNumber !== null &&
        storedUsername !== 'N/A' &&
        storedRollNumber !== 'N/A'
    ) {
        currentQuestion = parseInt(storedQuestion, 10);
        score = parseInt(storedScore, 10);
        const timeTakenInSeconds = parseFloat(storedTimeTaken);
        quizStartTime = new Date(Date.now() - timeTakenInSeconds * 1000);
        const usernameInput = document.getElementById('username');
        const rollNumberInput = document.getElementById('rollNumber');

        if (usernameInput && rollNumberInput) {
            usernameInput.value = storedUsername;
            rollNumberInput.value = storedRollNumber;
        }

        showQuestion();
        return true; // Added to indicate that quiz state is loaded successfully
    } else {
        showStartPage();
        return false; // Added to indicate that quiz state is not loaded
    }
}


function showStartPage() {
    // Display input fields for username and roll number before the quiz starts
    const storedUsername = localStorage.getItem('username');
    const storedRollNumber = localStorage.getItem('rollNumber');

    const usernameInput = document.getElementById('username');
    const rollNumberInput = document.getElementById('rollNumber');

    if (!usernameInput || !rollNumberInput) {
        console.error('Username or Roll Number input not found.');
        return;
    }

    if (storedUsername && storedRollNumber && storedUsername !== 'N/A' && storedRollNumber !== 'N/A') {
        // If there are stored values, set them in the input fields
        usernameInput.value = storedUsername;
        rollNumberInput.value = storedRollNumber;
    }

    quizContainer.innerHTML = `
        <form id="startForm">
            <label for="username">Username:</label>
            <input type="text" id="username" value="${storedUsername || ''}" required />
            <label for="rollNumber">Roll Number:</label>
            <input type="text" id="rollNumber" value="${storedRollNumber || ''}" required />
            <button type="button" onclick="startQuiz()">Start Quiz</button>
        </form>
    `;
    checkLocalStorage(); // Add this line
}


function showQuestion() {
    let timeDisplay = document.getElementById('timeDisplay');
    if (!timeDisplay) {
        timeDisplay = document.createElement('div');
        timeDisplay.id = 'timeDisplay';
        quizContainer.appendChild(timeDisplay);
    }

    if (!questions || currentQuestion < 1 || currentQuestion > questions.length) {
        console.error('Questions not loaded or invalid current question index.');
        return;
    }

    const questionData = questions[currentQuestion - 1];

    if (!questionData) {
        console.error('Question data not found for current question index.');
        return;
    }

    quizContainer.innerHTML = `
        <div id="timeDisplay"></div>
        <h2>Question ${currentQuestion}: ${questionData.question}</h2>
        <div class="options">
            ${questionData.options.map((option, index) => `
                <label>
                    <input type="radio" name="answer" value="${option}" />
                    ${option}
                </label>
            `).join('')}
        </div>
        <button onclick="handleAnswer()">Next</button>
    `;

    updateTimerDisplay();
}

function saveQuizState() {
    localStorage.setItem('currentQuestion', currentQuestion.toString());
    localStorage.setItem('score', score.toString());

    const usernameInput = document.getElementById('username');
    const rollNumberInput = document.getElementById('rollNumber');

    const username = usernameInput ? usernameInput.value.trim() || 'N/A' : 'N/A';
    const rollNumber = rollNumberInput ? rollNumberInput.value.trim() || 'N/A' : 'N/A';

    localStorage.setItem('username', username);
    localStorage.setItem('rollNumber', rollNumber);

    const currentTime = new Date();
    const timeTakenInSeconds = (currentTime - quizStartTime) / 1000;
    localStorage.setItem('timeTaken', timeTakenInSeconds.toString());
}

function shuffleQuestions() {
    questions = shuffleArray(questions);

    questions.forEach(question => {
        question.options = shuffleArray(question.options);
    });
}

function updateTimerDisplay() {
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
        const currentTime = new Date();
        const timeTakenInSeconds = (currentTime - quizStartTime) / 1000;
        const minutes = Math.floor(timeTakenInSeconds / 60);
        const seconds = Math.floor(timeTakenInSeconds % 60);
        const formattedTime = `${padZero(minutes)}:${padZero(seconds)}`;

        timeDisplay.innerText = formattedTime;
    }
}

timerInterval = setInterval(updateTimerDisplay, 1000);

function handleAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    const nextButton = document.querySelector('button');

    if (selectedOption && !nextButton.disabled) {
        nextButton.disabled = true;

        const userAnswer = selectedOption.value;
        const currentQuestionData = questions[currentQuestion - 1];

        if (currentQuestionData) {
            const correctAnswer = currentQuestionData.correctAnswer;

            if (userAnswer === correctAnswer) {
                score++;
                selectedOption.parentNode.style.color = 'green';
            } else {
                selectedOption.parentNode.style.color = 'red';
            }

            displayAnswerFeedback(userAnswer, correctAnswer);
            currentQuestion++;

            saveQuizState();

            if (currentQuestion <= questions.length) {
                setTimeout(() => {
                    selectedOption.parentNode.style.color = '';
                    showQuestion();
                    nextButton.disabled = false;
                }, 3000);
            } else {
                quizEndTime = new Date();
                setTimeout(() => {
                    selectedOption.parentNode.style.color = '';
                    showResult();
                }, 3000);
            }
        } else {
            console.error('Question data not found for current question index.');
        }
    }
}

function displayAnswerFeedback(userAnswer, correctAnswer) {
    const questionData = questions[currentQuestion - 1];
    const isCorrect = userAnswer === correctAnswer;

    quizContainer.innerHTML += `
        <p>${isCorrect ? 'Correct!' : 'Wrong!'}</p>
        <p>Explanation: ${questionData.explanation}</p>
    `;
}

function shuffleArray(array) {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showResult() {
    const totalQuestions = questions.length;
    const percentage = (score / totalQuestions) * 100;

    const usernameInput = document.getElementById('username');
    const rollNumberInput = document.getElementById('rollNumber');

    // Check if the input fields exist before accessing their values
    const username = currentUsername || (usernameInput ? usernameInput.value || 'N/A' : 'N/A');
    const rollNumber = currentRollNumber || (rollNumberInput ? rollNumberInput.value || 'N/A' : 'N/A');

    resultContainer.innerHTML = `
        <h2>Quiz Result</h2>
        <p>Name: ${username}</p>
        <p>Roll Number: ${rollNumber}</p>
        <p>Your Score: ${score} out of ${totalQuestions}</p>
        <p>Percentile: ${percentage.toFixed(2)}%</p>
        <p>Time Taken: ${calculateTimeTaken()}</p>
        <button onclick="reviewQuiz()">Review Questions</button>
    `;
    resultContainer.classList.remove('hidden');

    // Save the username and roll number in the localStorage with different keys
    localStorage.setItem('reportUsername', username);
    localStorage.setItem('reportRollNumber', rollNumber);

    // Call saveQuizResultForReport before resetting values
    saveQuizResultForReport();

    // Reset quiz state and current question index
    localStorage.removeItem('currentQuestion');
    localStorage.removeItem('score');
    localStorage.removeItem('timeTaken');
    // Do not remove the username and roll number from localStorage

    currentQuestion = 0;
    score = 0;

    // Clear the timer interval
    clearInterval(timerInterval);

    // Call checkLocalStorage again to ensure the correct values are printed
    checkLocalStorage();
}


function calculateTimeTaken() {
    const currentTime = new Date();
    const timeTakenInSeconds = (currentTime - quizStartTime) / 1000;
    const minutes = Math.floor(timeTakenInSeconds / 60);
    const seconds = Math.floor(timeTakenInSeconds % 60);

    return `${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(value) {
    return value < 10 ? `0${value}` : value;
}

function reviewQuiz() {
    resultContainer.innerHTML += `
        <div class="review-container">
            ${questions.map((question, index) => `
                <div class="question">${index + 1}. ${question.question}</div>
                <div class="${question.options.indexOf(question.correctAnswer) === index ? 'correct' : 'wrong'}">
                    Your Answer: ${question.options[index]}
                </div>
                <div class="explanation">Explanation: ${question.explanation}</div>
            `).join('')}
        </div>
    `;
    resultContainer.querySelector('.review-container').classList.remove('hidden');
}

function checkLocalStorage() {
    const storedUsername = localStorage.getItem('username');
    const storedRollNumber = localStorage.getItem('rollNumber');
    console.log('Stored Username in checkLocalStorage:', storedUsername);
    console.log('Stored Roll Number in checkLocalStorage:', storedRollNumber);
}



function saveQuizResultForReport() {
    const reportUsername = localStorage.getItem('reportUsername') || 'N/A';
    const reportRollNumber = localStorage.getItem('reportRollNumber') || 'N/A';
    const totalQuestions = questions.length;
    const attemptedQuestions = currentQuestion - 1 >= 0 ? currentQuestion - 1 : 0;
    const correctAnswers = score >= 0 ? score : 0;
    const wrongAnswers = attemptedQuestions - correctAnswers >= 0 ? attemptedQuestions - correctAnswers : 0;

    // Store username and rollNumber in localStorage
    localStorage.setItem('reportUsername', reportUsername);
    localStorage.setItem('reportRollNumber', reportRollNumber);

    const quizResultData = {
        name: reportUsername,
        rollNumber: reportRollNumber,
        totalQuestions: totalQuestions,
        attemptedQuestions: attemptedQuestions,
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers
    };

    const existingData = getQuizReportData();
    existingData.push(quizResultData);

    localStorage.setItem('QuizResultReportDataSet', JSON.stringify(existingData));
}

function logout() {
    // Clear login data
    localStorage.removeItem('quizResultLogin');

    // Show the login section and hide the quiz report section
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('quizReportSection').style.display = 'none';
}


checkLocalStorage();
showStartPage(); // Call showStartPage on page load
