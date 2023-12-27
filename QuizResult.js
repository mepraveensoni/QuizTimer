// QuizResult.js
document.addEventListener("DOMContentLoaded", function () {
    // Check if the user is already logged in
    const storedLoginData = localStorage.getItem('quizResultLogin');
    if (storedLoginData) {
        const loginData = JSON.parse(storedLoginData);
        const currentTime = new Date().getTime();
        
        // Log out after 30 minutes (30 * 60 * 1000 milliseconds)
        const sessionDuration = 30 * 60 * 1000;

        if (currentTime - loginData.loginTime < sessionDuration) {
            // User is still within the session duration, so keep them logged in
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('quizResultSection').style.display = 'block';
            // Display Quiz Result Details - You can customize this part
            const quizResultDetails = document.getElementById('quizResultDetails');
            quizResultDetails.textContent = `Welcome, ${loginData.username}! Here are your quiz results.`;
        } else {
            // Session has expired, clear the login data
            localStorage.removeItem('quizResultLogin');
        }
    }
});

// Function to handle login
function login() {
    const username = document.getElementById('username').value;
    const pin = document.getElementById('pin').value;

    // Replace these fixed credentials with your actual authentication logic
    if (username === 'Quiz_Admin' && pin === '123456') {
        const loginTime = new Date().getTime();
        const loginData = { username, loginTime };
        localStorage.setItem('quizResultLogin', JSON.stringify(loginData));

        // Hide the login section and show the quiz result section
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('quizResultSection').style.display = 'block';
    } else {
        alert('Invalid credentials. Please try again.');
    }
}
