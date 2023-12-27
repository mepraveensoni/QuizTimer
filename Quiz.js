let currentQuestion = 0;
let score = 0;
const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');

let quizStartTime;
let quizEndTime;

let quizStarted = false;

function showStartPage() {
    // Display input fields for username and roll number before the quiz starts
    quizContainer.innerHTML = `
        <form id="startForm">
            <label for="username">Username:</label>
            <input type="text" id="username" required />
            <label for="rollNumber">Roll Number:</label>
            <input type="text" id="rollNumber" required />
            <button type="button" onclick="startQuiz()">Start Quiz</button>
        </form>
    `;
}

function startQuiz() {
    const username = document.getElementById('username').value;
    const rollNumber = document.getElementById('rollNumber').value;

    // Check if both username and roll number are provided
    if (username.trim() === '' || rollNumber.trim() === '') {
        //alert('Please enter both your username and roll number before starting the quiz.');
        return;
    }

    // Store the username and roll number for later use
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('rollNumber', rollNumber);

    quizStartTime = new Date();
    currentQuestion++;
    showQuestion();
}


function showQuestion() {
    // Create or obtain the timeDisplay element
    let timeDisplay = document.getElementById('timeDisplay');
    if (!timeDisplay) {
        timeDisplay = document.createElement('div');
        timeDisplay.id = 'timeDisplay';
        quizContainer.appendChild(timeDisplay);
    }

    // Display the quiz questions
    const questionData = questions[currentQuestion - 1];

    quizContainer.innerHTML = `
        <div id="timeDisplay"></div>
        <h2>${questionData.question}</h2>
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

    // Update the time display every second
    updateTimerDisplay();
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
        setTimeout(updateTimerDisplay, 1000);
    }
}


function handleAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    const nextButton = document.querySelector('button');

    if (selectedOption && !nextButton.disabled) {
        nextButton.disabled = true;

        const userAnswer = selectedOption.value;
        const correctAnswer = questions[currentQuestion - 1].correctAnswer;

        if (userAnswer === correctAnswer) {
            score++;
            selectedOption.parentNode.style.color = 'green'; // Change text color to green for correct answer
        } else {
            selectedOption.parentNode.style.color = 'red'; // Change text color to red for wrong answer
        }

        displayAnswerFeedback(userAnswer, correctAnswer);
        currentQuestion++;

        if (currentQuestion <= questions.length) {
            setTimeout(() => {
                selectedOption.parentNode.style.color = ''; // Reset text color
                showQuestion();
                nextButton.disabled = false;
            }, 3000);
        } else {
            quizEndTime = new Date();
            setTimeout(() => {
                selectedOption.parentNode.style.color = ''; // Reset text color
                showResult();
            }, 3000);
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

function showResult() {
    const totalQuestions = questions.length;
    const percentage = (score / totalQuestions) * 100;

    // Retrieve the username and roll number from storage
    const username = sessionStorage.getItem('username') || 'N/A';
    const rollNumber = sessionStorage.getItem('rollNumber') || 'N/A';

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


startQuiz();
