// questioneditor.js

// Function to handle login
// Function to handle login
function login() {
    const username = document.getElementById('username').value;
    const pin = document.getElementById('pin').value;

    // Replace these fixed credentials with your actual authentication logic
    if (username === 'Quiz_Admin' && pin === '123456') {
        const loginTime = new Date().getTime();
        const loginData = { username, loginTime };
        localStorage.setItem('quizLogin', JSON.stringify(loginData));

        // Hide the login section and show the question editor section
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('questionEditorSection').style.display = 'block';
        updateQuestionTable();  // Update the question table after successful login
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

// Check if the user is already logged in
const storedLoginData = localStorage.getItem('quizLogin');

if (storedLoginData) {
    const loginData = JSON.parse(storedLoginData);
    const currentTime = new Date().getTime();

    // Log out after 30 minutes (30 * 60 * 1000 milliseconds)
    const sessionDuration = 30 * 60 * 1000;

    if (currentTime - loginData.loginTime < sessionDuration) {
        // User is still within the session duration, so keep them logged in
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('questionEditorSection').style.display = 'block';
    } else {
        // Session has expired, clear the login data
        localStorage.removeItem('quizLogin');
    }
}


// Function to update and refresh the question table
function updateQuestionTable() {
    const tableBody = document.getElementById('questionTableBody');
    // Clear existing table rows
    tableBody.innerHTML = '';

    // Iterate through questions and populate the table
    questions.forEach((question, index) => {
        const row = tableBody.insertRow();
        const cellQuestion = row.insertCell(0);
        const cellOptions = row.insertCell(1);
        const cellCorrectAnswer = row.insertCell(2);
        const cellExplanation = row.insertCell(3);
        const cellActions = row.insertCell(4);

        // Populate cells with question data
        cellQuestion.innerText = question.question;
        cellOptions.innerText = question.options.join(', ');
        cellCorrectAnswer.innerText = question.correctAnswer;
        cellExplanation.innerText = question.explanation;

        // Add an action to update or delete the question
        const updateButton = document.createElement('button');
        updateButton.innerText = 'Update';
        updateButton.onclick = function() {
            // Set the selected question index in local storage
            localStorage.setItem('selectedQuestionIndex', index);
            // Update the form fields with the selected question's data
            document.getElementById('question').value = question.question;
            document.getElementById('options').value = question.options.join(', ');
            document.getElementById('correctAnswer').value = question.correctAnswer;
            document.getElementById('explanation').value = question.explanation;
        };
        cellActions.appendChild(updateButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = function() {
            // Delete the question and refresh the table
            questions.splice(index, 1);
            localStorage.setItem('questions', JSON.stringify(questions));
            updateQuestionTable();
        };
        cellActions.appendChild(deleteButton);
    });
}

// Function to add a new question
function addQuestion() {
    // Get values from the form
    const question = document.getElementById('question').value;
    const options = document.getElementById('options').value.split(',').map(option => option.trim());
    const correctAnswer = document.getElementById('correctAnswer').value;
    const explanation = document.getElementById('explanation').value;

    // Create a new question object
    const newQuestion = {
        question,
        options,
        correctAnswer,
        explanation,
    };

    // Add the new question to the questions array
    questions.push(newQuestion);

    // Save questions to localStorage
    localStorage.setItem('questions', JSON.stringify(questions));

    // Clear the form fields
    clearForm();

    // Update and refresh the question table
    updateQuestionTable();
}

// Function to update an existing question
function updateQuestion() {
    // Get the selected question index from localStorage or use 0 as the default value
    const questionIndex = localStorage.getItem('selectedQuestionIndex') || 0;

    // Get values from the form
    const question = document.getElementById('question').value;
    const options = document.getElementById('options').value.split(',').map(option => option.trim());
    const correctAnswer = document.getElementById('correctAnswer').value;
    const explanation = document.getElementById('explanation').value;

    // Update the question in the questions array
    questions[questionIndex] = {
        question,
        options,
        correctAnswer,
        explanation,
    };

    // Save questions to localStorage
    localStorage.setItem('questions', JSON.stringify(questions));

    // Clear the form fields
    clearForm();

    // Update and refresh the question table
    updateQuestionTable();
}

// Function to delete an existing question
function deleteQuestion() {
    // Get the selected question index from localStorage or use 0 as the default value
    const questionIndex = localStorage.getItem('selectedQuestionIndex') || 0;

    // Remove the question from the questions array
    questions.splice(questionIndex, 1);

    // Save questions to localStorage
    localStorage.setItem('questions', JSON.stringify(questions));

    // Clear the form fields
    clearForm();

    // Update and refresh the question table
    updateQuestionTable();
}

// Function to clear the form fields
function clearForm() {
    // Clear the form fields
    document.getElementById('question').value = '';
    document.getElementById('options').value = '';
    document.getElementById('correctAnswer').value = '';
    document.getElementById('explanation').value = '';
}

// Ensure that these functions are accessible globally
window.addQuestion = addQuestion;
window.updateQuestion = updateQuestion;
window.deleteQuestion = deleteQuestion;
window.clearForm = clearForm;

// Include questions.js only if not already defined
if (typeof window.questions === 'undefined') {
    // Include questions.js
    const script = document.createElement('script');
    script.src = 'questions.js';
    document.head.appendChild(script);

    // Initialize questions variable if not already defined
    window.questions = JSON.parse(localStorage.getItem('questions')) || [];
}

// Call the function to initially populate the table
updateQuestionTable();
