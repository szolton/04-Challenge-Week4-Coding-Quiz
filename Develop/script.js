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
            { text: "Quotess", correct: true},
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

const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const timerElement = document.getElementById("timer");
const feedbackElement = document.getElementById("feedback");
const scoreContainer = document.querySelector(".score-container");

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 180; // Set initial time in seconds

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
    startTimer();
}

function startTimer(){
    const timerInterval = setInterval(() => {
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

function showQuestion(){
    feedbackElement.style.display = "none"; // Hide the feedback element
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    // Clear existing answer buttons
    answerButtonsElement.innerHTML = '';

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        button.dataset.correct = answer.correct;
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

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

function showFeedback(text){
    feedbackElement.textContent = text;
    feedbackElement.style.display = "block"; // Show the feedback element
}

function showScore(){
    // Hide the quiz elements
    document.querySelector(".quiz").style.display = "none";

    // Display the final score
    const finalScoreElement = document.createElement("div");
    finalScoreElement.textContent = `You scored ${score} out of ${questions.length}.`;
    finalScoreElement.classList.add("final-score");
    scoreContainer.appendChild(finalScoreElement);

    // Show the name container and submit button
    const nameContainer = document.querySelector(".name-container");
    nameContainer.style.display = "flex";
    const submitButton = document.getElementById("submit-btn");
    submitButton.style.display = "block";

    // Change the "Coding Quiz Challenge" text
    document.querySelector("h1").textContent = "All done!";
    
    // Add event listener to the final score text
    finalScoreElement.addEventListener("click", function() {
        // Code to handle displaying the high scores or any other action
    });
}













function endQuiz(){
    questionElement.innerHTML = `Time's up! You scored ${score} out of ${questions.length}.`;
  
}

startQuiz();
