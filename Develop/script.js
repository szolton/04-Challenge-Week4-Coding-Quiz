// this is the array of quiz questions and answers
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
    //  {
    //     question: "The condition in an if/else statement is enclosed with _____",
    //     answers: [
    //         { text: "Quotes", correct: false},
    //         { text: "Curly Brackets", correct: false},
    //         { text: "Parenthesis", correct: true},
    //         { text: "Square Brackets", correct: false},
    //     ]
    // },

    // {
    //     question: "Arrays in JavaScript can be used to store ____",
    //     answers: [
    //         { text: "Numbers and Strings", correct: false},
    //         { text: "Other Arrays", correct: false},
    //         { text: "Booleans", correct: false},
    //         { text: "All of the Above", correct: true},
    //     ]
    // },

    // {
    //     question: "String values must be enclosed within ___ when being assigned to variables.",
    //     answers: [
    //         { text: "Commas", correct: false},
    //         { text: "Curly Brackets", correct: false},
    //         { text: "Quotes", correct: true},
    //         { text: "Parenthesis", correct: false},
    //     ]
    // },
 
    // {
    //     question: "A very useful tool used during development and debugging for printing content to the debugger is:",
    //     answers: [
    //         { text: "JavaScript", correct: false},
    //         { text: "Terminal/Bash", correct: false},
    //         { text: "For loops", correct: false},
    //         { text: "Console.log", correct: true},
    //     ]
    // },

    // {
    //     question: "Where is JavaScript placed inside an HTML document or page?",
    //     answers: [
    //         { text: "In the meta section", correct: false},
    //         { text: "In the footer section with a script tag", correct: false},
    //         { text: "In the body and head sections with a script tag", correct: true},
    //         { text: "In the title section", correct: false},
    //     ]
    // },
    
    // {
    //     question: "What is the name of a statement that is used to exit or end a loop?",
    //     answers: [
    //         { text: "Close statement", correct: false},
    //         { text: "Break statement", correct: true},
    //         { text: "Conditional statement", correct: false},
    //         { text: "Falter statement", correct: false},
    //     ]
    // },

    // {
    //     question: "How do you write 'Hello World' in an alert box?",
    //     answers: [
    //         { text: "alertBox('Hello World')", correct: false},
    //         { text: "alert('Hello World')", correct: true},
    //         { text: "msgBox('Hello World')", correct: false},
    //         { text: "msg('Hello World')", correct: false},
    //     ]
    // },
    


];

// HTML element references
const startBtn = document.querySelector("#start-btn");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const timerElement = document.getElementById("timer");
const feedbackElement = document.getElementById("feedback");
const scoreContainer = document.querySelector(".score-container");
const highScoresLink = document.getElementById("high-scores-link");
const highScoresContainer = document.querySelector("#results");
highScoresContainer.style.visibility = "hidden";

// other variables. this sets initial time in seconds, references the results box, and the timer interval
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 180;
let clearHighScoresResultsElement;
let timerInterval;

// this adds an event listener to the start button, hides the start button, hides the intro quiz, and shows the quiz section
startBtn.addEventListener('click', () => {
    startQuiz();
    startBtn.style.display = "none"; 
    document.querySelector(".intro-start").style.display = "none"; 
    document.querySelector(".quiz").style.display = "block";
});

// this adds an event listener to the high scores link, shows the high scores list, and hides the intro start section
highScoresLink.addEventListener("click", () => {
    //const highScoresContainer = document.querySelector("#results");
    highScoresContainer.style.visibility = "visible";
    const highScoresList = document.querySelector(".high-scores-list");
    highScoresContainer.style.display = "block"; 
    highScoresList.style.display = "block"; 
    document.querySelector(".intro-start").style.display = "none"; 

    // this shows the Go Back button
    document.getElementById("go-back-btn").style.display = "inline";


    showHighScores();
    // Here we interact with LocalStorage
});

// this is the function to start the quiz
function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();

     // Reset the timer and start it again
     clearInterval(timerInterval);
     timerInterval = null;
     timeLeft = 180;
     startTimer();

     document.querySelector("#timer").style.display = "block";

    
    // Check if the timer is already running
    if (!timerInterval) {
        startTimer();
    } else {
        // If the timer is already running, update the timer display without resetting the timer
        const minutes = Math.floor(timeLeft / 60); 
        let seconds = timeLeft % 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;

        timerElement.textContent = `${minutes}:${seconds}`;
    }

    // this shows the high scores link
    highScoresLink.style.display = "inline";
}


// this is the end quiz function that clears the timer interval and hides the quiz section
function endQuiz() {
    clearInterval(timerInterval);
    document.querySelector(".quiz").style.display = "none";
}

// this is the function to start the timer
function startTimer(){
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60); 
        let seconds = timeLeft % 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;

        timerElement.textContent = `${minutes}:${seconds}`;

        if (currentQuestionIndex >= questions.length) {
            endQuiz(); 
        } else {
            timeLeft--;
        }
        
    }, 1000);
}

// this is a function to display a question
function showQuestion(){
    feedbackElement.style.display = "none";
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    // this clears existing answer buttons
    answerButtonsElement.innerHTML = '';

    // this creates buttons for each answer
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        button.dataset.correct = answer.correct;
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });

    // start the timer if it hasn't started yet
    if (!timerInterval) {
        startTimer();
    }
}

// this is a function to handle the answer selection
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
        
        const correctBtn = Array.from(answerButtonsElement.children).find(button => button.dataset.correct === "true");
        if (correctBtn) {
            correctBtn.classList.add("correct");
        }
   
        timeLeft -= 10; 
        if (timeLeft < 0) {
            timeLeft = 0;
        }
        timerElement.textContent = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;
    }

    // this disables all buttons after an answer is selected
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(button => {
        button.removeEventListener("click", selectAnswer);
    });

    // this shows the next question after a delay
    setTimeout(() => {
        currentQuestionIndex++;
        if(currentQuestionIndex < questions.length){
            showQuestion();
        }else{
            showScore();
        }
    }, 1000);
}

// this is the function to display feedback
function showFeedback(text){
    feedbackElement.textContent = text;
    feedbackElement.style.display = "block"; // this shows the feedback element
}

function submitInitials() {
    
    // this gets the initials from the input field
    const initialsInput = document.getElementById('name-input');
    if (initialsInput) {
        const initials = initialsInput.value;
        const highScores = JSON.parse(localStorage.getItem('high-scores-list')) || [];
        

        // this checks if the initials have already been submitted
        const existingScore = highScores.find(score => score.initials === initials);
        if (existingScore) {
            // this is a console log where you can show a message or perform some action
            console.log("Initials already submitted!");
            return;
        }

        const newScore = { initials, score };
        highScores.push(newScore);
        localStorage.setItem('high-scores-list', JSON.stringify(highScores));

        // this hides the name container and submit button
        const nameContainer = document.querySelector(".name-container");
        if (nameContainer) {
            nameContainer.style.display = "none";
        }
        const submitButton = document.getElementById("submit-btn");
        if (submitButton) {
            submitButton.style.display = "none";
        }

        // this shows the high scores container and buttons
        const highScoresContainer = document.querySelector(".high-scores-list");
        if (highScoresContainer) {
            highScoresContainer.style.display = "block";
        }

        // this shows the "Go Back" and "Clear High Scores" buttons
        const goBackButton = document.getElementById("go-back-btn");
        goBackButton.style.display = "block";

        const clearHighScoresButton = document.getElementById("clear-high-scores-btn");
        if (clearHighScoresButton) {
            clearHighScoresButton.style.display = "block";
        }

        // this sets the submitClicked flag to true
        submitClicked = true;

        // this displays the high scores
        showHighScores();
    }
}

// this adds an event listener to the submit button
document.getElementById("submit-btn").addEventListener('click', () => {
    submitInitials();
    submitClicked = true;
});

// this is a function to display the final score and input for initials
function showScore() {
   
    // this hides the quiz elements
    document.querySelector(".quiz").style.display = "none";

    // this hides the timer
    timerElement.style.display = "none";

    // this shows the user the final score
    const finalScoreElement = document.createElement("div");
    finalScoreElement.textContent = `You scored ${score} out of ${questions.length}.`;
    finalScoreElement.classList.add("final-score");
    scoreContainer.appendChild(finalScoreElement);

    // this stores a reference to the results box
    clearHighScoresResultsElement = finalScoreElement;

    // this shows the name container and submit button
    const nameContainer = document.querySelector(".name-container");
    nameContainer.style.display = "flex";
    const submitButton = document.getElementById("submit-btn");
    submitButton.style.display = "block";

    // this shows the clear high scores button
    const clearHighScoresButton = document.getElementById("clear-high-scores-btn");
    clearHighScoresButton.classList.remove("hide");

    // this shows the "Go Back" button
    const goBackButton = document.getElementById("go-back-btn");
    goBackButton.classList.remove("hide");

    // this changes the "Coding Quiz Challenge" text
    document.querySelector("h1").textContent = "All done!";

    // this shows the high scores list
    showHighScores();
}

// this defines a variable to track whether the submit button has been clicked
let submitClicked = false;

// this is a function to display high scores
function showHighScores() {
    try {
        const highScores = JSON.parse(localStorage.getItem('high-scores-list')) || [];
        console.log("scores: ", highScores)
        // this clears existing high scores
        highScoresContainer.style.visibility = "visible";
        const highScoresList = document.querySelector(".high-scores-list");
        highScoresList.innerHTML = "";

        // this sorts the high scores in descending order
        highScores.sort((a, b) => b.score - a.score);

        // this displays the high scores only if submit button has been clicked
       // if (submitClicked) {
            highScores.forEach((score, index) => {
                const scoreItem = document.createElement("li");
                scoreItem.textContent = `${index + 1}. ${score.initials} - ${score.score}`;
                scoreItem.classList.add("high-score");
                if (index % 2 === 0) {
                    scoreItem.style.backgroundColor = "whitesmoke"; // this alternates a white background
                } else {
                    scoreItem.style.backgroundColor = "#b194d3"; // this alternates a purple background
                }
                highScoresList.appendChild(scoreItem);
            });

            // this shows the high scores list
            document.getElementById("results").style.display = "block";
       // }
    } catch (error) {
        console.error("An error occurred in showHighScores:", error);
    }
}

// this adds an event listener to the clear high scores button
document.getElementById("clear-high-scores-btn").addEventListener('click', () => {
    localStorage.removeItem('high-scores-list');
    // this hides the high scores list
    const results = document.getElementById("results");
    results.style.display = "none";

    // this clears up the existing high scores from the DOM
    const highScoresList = document.querySelector(".high-scores-list");
    highScoresList.innerHTML = "";
});

// this adds an event listener to the go back button
document.getElementById("go-back-btn").addEventListener('click', () => {
    resetQuiz();
    document.querySelector(".quiz").style.display = "none"; // this hides the quiz section
    document.querySelector(".high-scores").style.display = "none"; // this hides the high scores list
    document.getElementById("go-back-btn").style.display = "none"; // this hides the go back button
    document.getElementById("clear-high-scores-btn").style.display = "none"; // this hides the clear high scores button
    document.querySelector(".intro-start").style.display = "block"; // this shows the start page
    highScoresContainer.style.visibility = "hidden";
});

// this is a function to reset the quiz
function resetQuiz() {

    // these are the reset variables
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 180;
    submitClicked = false;

    if (!timerInterval) {
        startTimer();
    }

    // this resets the timer
    timerElement.textContent = '';
    clearInterval(timerInterval);

    // this shows the start button and intro quiz stuff
    startBtn.style.display = "block";
    document.querySelector(".intro-start").style.display = "block";

    // this hides the quiz section and name container
    document.querySelector(".quiz").style.display = "none";
    document.querySelector(".name-container").style.display = "none";
    highScoresContainer.style.visibility = "hidden";

    // this removes final score display
    scoreContainer.innerHTML = '';

    // this changes the "Coding Quiz Challenge" text back to its original value
    document.querySelector("h1").textContent = "Coding Quiz Challenge";

    // Hide high scores list
    const highScoresList = document.querySelector("#results.high-scores");
    highScoresList.style.display = "none";

    highScoresContainer.style.visibility = "hidden";

}


// Add this at the end of your JavaScript file to show high scores on page load
window.addEventListener('load', () => {
  //  showHighScores();
});
