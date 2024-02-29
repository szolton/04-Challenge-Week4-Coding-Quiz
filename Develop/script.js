const questions = [
    {
        question: "Which is the largest animal in the world?",
        answers: [
            { text: "Shark", correct: false},
            { text: "Blue whale", correct: true},
            { text: "Elephant", correct: false},
            { text: "Giraffe", correct: false},
        ]
    }, 

    {     
        question: "Which is the smallest country in the world?",
        answers: [
            { text: "Vatican City", correct: true},
            { text: "Bhutan", correct: true},
            { text: "Nepal", correct: false},
            { text: "Shri Lanka", correct: false},
        ]
    },
    {     
        question: "Which is the smallest continent in the world?",
        answers: [
            { text: "Asia", correct: false},
            { text: "Australia", correct: true},
            { text: "Arctic", correct: false},
            { text: "Africa", correct: false},
        ]
    },

    {     
        question: "Which is the largest desert in the world?",
        answers: [
            { text: "Kalahari", correct: false},
            { text: "Gobi", correct: false},
            { text: "Sahara", correct: false},
            { text: "Antarctica", correct: true},
        ]
    }

];

const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const timerElement = document.getElementById("timer");
const feedbackElement = document.getElementById("feedback");

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
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
}

function endQuiz(){
    questionElement.innerHTML = `Time's up! You scored ${score} out of ${questions.length}.`;
}

startQuiz();
