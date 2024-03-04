// Array of quiz questions and answers
const questions = [
    {
        question: "Commonly used data types DO Not Include:",
        answers: [
            { text: "Strings", correct: false},
            { text: "Booleans", correct: false},
            { text: "Alerts", correct: true},
            { text: "Numbers", correct: false},
        ]
    },
     {
        question: "The condition in an if/else statement is enclosed with _____",
        answers: [
            { text: "Quotes", correct: false},
            { text: "Curly Brackets", correct: false},
            { text: "Parenthesis", correct: true},
            { text: "Square Brackets", correct: false},
        ]
    },

    {
        question: "Arrays in JavaScript can be used to store ____",
        answers: [
            { text: "Numbers and Strings", correct: false},
            { text: "Other Arrays", correct: false},
            { text: "Booleans", correct: false},
            { text: "All of the Above", correct: true},
        ]
    },

    {
        question: "String values must be enclosed within ___ when being assigned to variables.",
        answers: [
            { text: "Commas", correct: false},
            { text: "Curly Brackets", correct: false},
            { text: "Quotes", correct: true},
            { text: "Parenthesis", correct: false},
        ]
    },
 
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        answers: [
            { text: "JavaScript", correct: false},
            { text: "Terminal/Bash", correct: false},
            { text: "For loops", correct: false},
            { text: "Console.log", correct: true},
        ]
    }
];

// HTML element references
const startBtn = document.querySelector("#start-btn");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const timerElement = document.getElementById("timer");
const feedbackElement = document.getElementById("feedback");
const scoreContainer = document.querySelector(".score-container");
const highScoresLink = document.getElementById("high-scores-link");

// Other variables
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 180; // Set initial time in seconds
let clearHighScoresResultsElement; // Reference to the results box
let timerInterval; // Reference to the timer interval

// Add event listener to the start button
startBtn.addEventListener('click', () => {
    startQuiz();
    startBtn.style.display = "none"; // Hide the start button
    document.querySelector(".intro-start").style.display = "none"; // Hide the intro quiz stuff
    document.querySelector(".quiz").style.display = "block"; // Show the quiz section
});

// Add event listener to the high scores link
highScoresLink.addEventListener("click", () => {
    const highScoresContainer = document.querySelector("#results");
    highScoresContainer.style.display = "block"; // Show the high scores list
    document.querySelector(".intro-start").style.display = "none"; // Hide the intro-start section

    // Show the Go Back button
    document.getElementById("go-back-btn").style.display = "inline";
});


// Function to start the quiz
function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
    startTimer();

    // Show the high scores link
    highScoresLink.style.display = "inline";
}


// Function to start the timer
function startTimer(){
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60); // Calculate minutes
        let seconds = timeLeft % 60; // Calculate remaining seconds

        // Add leading zero to seconds if less than 10
        seconds = seconds < 10 ? '0' + seconds : seconds;

        // Display the time in MM:SS format
        timerElement.textContent = `${minutes}:${seconds}`;

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            endQuiz();
        } else {
            timeLeft--;
        }
    }, 1000);
}

// Function to display a question
function showQuestion(){
    feedbackElement.style.display = "none"; // Hide the feedback element
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    // Clear existing answer buttons
    answerButtonsElement.innerHTML = '';

    // Create buttons for each answer
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        button.dataset.correct = answer.correct;
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

// Function to handle answer selection
function selectAnswer(e){
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
        showFeedback("Correct!");
    } else {
        selectedBtn.classList.add("incorrect");
        showFeedback("Incorrect!");
        // Highlight the correct answer
        const correctBtn = Array.from(answerButtonsElement.children).find(button => button.dataset.correct === "true");
        if (correctBtn) {
            correctBtn.classList.add("correct");
        }
        // Reduce time if answer is incorrect
        timeLeft -= 10; // Subtract 10 seconds
        if (timeLeft < 0) {
            timeLeft = 0;
        }
        timerElement.textContent = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;
    }

    // Disable all buttons after an answer is selected
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(button => {
        button.removeEventListener("click", selectAnswer);
    });

    // Show the next question after a delay
    setTimeout(() => {
        currentQuestionIndex++;
        if(currentQuestionIndex < questions.length){
            showQuestion();
        }else{
            showScore();
        }
    }, 1000);
}

// Function to display feedback
function showFeedback(text){
    feedbackElement.textContent = text;
    feedbackElement.style.display = "block"; // Show the feedback element
}

function submitInitials() {
    // Get the initials from the input field
    const initialsInput = document.getElementById('name-input');
    if (initialsInput) {
        const initials = initialsInput.value;
        const highScores = JSON.parse(localStorage.getItem('high-scores-list')) || [];

        const newScore = { initials, score };
        highScores.push(newScore);
        localStorage.setItem('high-scores-list', JSON.stringify(highScores));

        // Hide the name container and submit button
        const nameContainer = document.querySelector(".name-container");
        if (nameContainer) {
            nameContainer.style.display = "none";
        }
        const submitButton = document.getElementById("submit-btn");
        if (submitButton) {
            submitButton.style.display = "none";
        }

        // Show the high scores container and buttons
        const highScoresContainer = document.querySelector(".high-scores-list");
        if (highScoresContainer) {
            highScoresContainer.style.display = "block";
        }

        // Show the "Go Back" and "Clear High Scores" buttons
        const goBackButton = document.getElementById("go-back-btn");
        goBackButton.style.display = "block";

        const clearHighScoresButton = document.getElementById("clear-high-scores-btn");
        if (clearHighScoresButton) {
            clearHighScoresButton.style.display = "block";
        }

        // Set the submitClicked flag to true
        submitClicked = true;

        // Display high scores
        showHighScores();
    }
}

// Add event listener to the submit button
document.getElementById("submit-btn").addEventListener('click', () => {
    submitInitials();
    submitClicked = true; // Set submitClicked to true
});

// Function to display the final score and input for initials
function showScore() {
    // Hide the quiz elements
    document.querySelector(".quiz").style.display = "none";

    // Hide the timer
    timerElement.style.display = "none";

    // Display the final score
    const finalScoreElement = document.createElement("div");
    finalScoreElement.textContent = `You scored ${score} out of ${questions.length}.`;
    finalScoreElement.classList.add("final-score");
    scoreContainer.appendChild(finalScoreElement);

    // Store a reference to the results box
    clearHighScoresResultsElement = finalScoreElement;

    // Show the name container and submit button
    const nameContainer = document.querySelector(".name-container");
    nameContainer.style.display = "flex";
    const submitButton = document.getElementById("submit-btn");
    submitButton.style.display = "block";

    // Show the clear high scores button
    const clearHighScoresButton = document.getElementById("clear-high-scores-btn");
    clearHighScoresButton.classList.remove("hide");

    // Show the "Go Back" button
    const goBackButton = document.getElementById("go-back-btn");
    goBackButton.classList.remove("hide");

    // Change the "Coding Quiz Challenge" text
    document.querySelector("h1").textContent = "All done!";

    // Show the high scores list
    showHighScores();
}

// Define a variable to track whether the submit button has been clicked
let submitClicked = false;

// Function to display high scores
function showHighScores() {
    try {
        const highScores = JSON.parse(localStorage.getItem('high-scores-list')) || [];

        // Clear existing high scores
        const highScoresList = document.querySelector(".high-scores-list");
        highScoresList.innerHTML = "";

        // Sort high scores in descending order
        highScores.sort((a, b) => b.score - a.score);

        // Display high scores only if submit button has been clicked
        if (submitClicked) {
            highScores.forEach((score, index) => {
                const scoreItem = document.createElement("li");
                scoreItem.textContent = `${index + 1}. ${score.initials} - ${score.score}`;
                scoreItem.classList.add("high-score");
                if (index % 2 === 0) {
                    scoreItem.style.backgroundColor = "whitesmoke"; // Alternate white background
                } else {
                    scoreItem.style.backgroundColor = "#b194d3"; // Alternate purple background
                }
                highScoresList.appendChild(scoreItem);
            });

            // Show the high scores list
            document.getElementById("results").style.display = "block";
        }
    } catch (error) {
        console.error("An error occurred in showHighScores:", error);
    }
}

// Add event listener to the clear high scores button
document.getElementById("clear-high-scores-btn").addEventListener('click', () => {
    localStorage.removeItem('high-scores-list');
    // Hide the high scores list
    const results = document.getElementById("results");
    results.style.display = "none";

    // Clear existing high scores from the DOM
    const highScoresList = document.querySelector(".high-scores-list");
    highScoresList.innerHTML = "";
});

// Add event listener to the go back button
document.getElementById("go-back-btn").addEventListener('click', () => {
    resetQuiz();
    document.querySelector(".quiz").style.display = "none"; // Hide the quiz section
    document.querySelector(".high-scores").style.display = "none"; // Hide the high scores list
    document.getElementById("go-back-btn").style.display = "none"; // Hide the go back button
    document.getElementById("clear-high-scores-btn").style.display = "none"; // Hide the clear high scores button
    document.querySelector(".intro-start").style.display = "block"; // Show the start page
});

// Function to reset the quiz
function resetQuiz() {
    // Reset variables
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 180;
    submitClicked = false;

    // Reset the timer
    timerElement.textContent = '';
    clearInterval(timerInterval);

    // Show the start button and intro quiz stuff
    startBtn.style.display = "block";
    document.querySelector(".intro-start").style.display = "block";

    // Hide the quiz section and name container
    document.querySelector(".quiz").style.display = "none";
    document.querySelector(".name-container").style.display = "none";

    // Remove final score display
    scoreContainer.innerHTML = '';

    // Change the "Coding Quiz Challenge" text back to its original value
    document.querySelector("h1").textContent = "Coding Quiz Challenge";
}
