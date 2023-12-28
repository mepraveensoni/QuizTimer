document.addEventListener('DOMContentLoaded', function () {
    // Check if the user is already logged in
    const isLoggedIn = checkLoginStatus();

    // If logged in, display the quiz report
    if (isLoggedIn) {
        displayQuizReport();
    }
});

function checkLoginStatus() {
    const loginData = localStorage.getItem('quizResultLogin');

    if (loginData) {
        const { loginTime } = JSON.parse(loginData);
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - loginTime;
        const thirtyMinutesInMillis = 30 * 60 * 1000; // 30 minutes in milliseconds

        // Check if the elapsed time is less than 30 minutes
        if (elapsedTime <= thirtyMinutesInMillis) {
            // Hide the login section and show the quiz report section
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('quizReportSection').style.display = 'block';
            return true;
        }
    }

    // Clear login data if expired or not available
    localStorage.removeItem('quizResultLogin');
    return false;
}

function displayQuizReport() {
    const quizReportTable = document.getElementById('quizReportTable');
    const quizReportData = getQuizReportData();

    if (quizReportTable && quizReportData.length > 0) {
        const tbody = quizReportTable.querySelector('tbody');
        tbody.innerHTML = ''; // Clear the table body before populating with new data

        quizReportData.forEach(report => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${report.name}</td>
                <td>${report.rollNumber}</td>
                <td>${report.totalQuestions}</td>
                <td>${report.attemptedQuestions}</td>
                <td>${report.correctAnswers}</td>
                <td>${report.wrongAnswers}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

function getQuizReportData() {
    const quizReportData = localStorage.getItem('QuizResultReportDataSet');
    console.log('Quiz Report Data:', quizReportData);
    return quizReportData ? JSON.parse(quizReportData) : [];
}

// Function to handle login
function login() {
    const username = document.getElementById('username').value;
    const pin = document.getElementById('pin').value;

    // Replace these fixed credentials with your actual authentication logic
    if (username === 'Quiz_Admin' && pin === '123456') {
        const loginTime = new Date().getTime();
        const loginData = { username, loginTime };
        localStorage.setItem('quizResultLogin', JSON.stringify(loginData));

        // Hide the login section and show the quiz report section
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('quizReportSection').style.display = 'block';

        // Call displayQuizReport to show the report immediately after login
        displayQuizReport();
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function exportCsv() {
    const quizReportData = getQuizReportData();

    if (quizReportData.length === 0) {
        alert('No data to export.');
        return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    const formattedTime = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    let fileName = `Quiz_${formattedDate}_${formattedTime}.csv`;

    let csvContent = "data:text/csv;charset=utf-8," +
        "Name,Roll Number,Total Questions,Attempted Questions,Correct Answers,Wrong Answers\n";

    quizReportData.forEach(report => {
        csvContent += `${report.name},${report.rollNumber},${report.totalQuestions},${report.attemptedQuestions},${report.correctAnswers},${report.wrongAnswers}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.getElementById('exportCsvLink');

    // Use direct assignment for the href and download properties
    link.href = encodedUri;
    link.download = fileName;

    // Remove the click event listener to prevent multiple downloads
    link.removeEventListener('click', exportCsv);
}
