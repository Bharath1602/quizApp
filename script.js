let rulesCon = document.getElementById("rulesCon");
let startBtn = document.getElementById("startBtn");
let home = document.getElementById("home");
let qns = document.getElementById("qns");

let questionNumber = document.getElementById("questionNumber");
let currentQuestion = document.getElementById("currentQuestion");

let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");
let submitBtn = document.getElementById("submitBtn");

let optionsCont = document.getElementById("optionsCont");
let para = document.getElementById("para");

let res = document.getElementById("res");
let rescon = document.getElementById("rescon");

let questionsData = [];
let currentQuestionIndex = 0;

let optionsData = [];

let userAnswers = [];




// Function to display rules and regulations
function displayRules(data) {
    let { topic, duration, questions_count, correct_answer_marks, negative_marks } = data;

    let titleEle = document.createElement("h1");
    titleEle.classList.add("title-class");
    titleEle.textContent = data.title;
    rulesCon.appendChild(titleEle);

    let ulEle = document.createElement("ul");
    ulEle.classList.add("ul-style");
    rulesCon.appendChild(ulEle);

    function createListItem(text) {
        let liEle = document.createElement("li");
        liEle.textContent = text;
        liEle.classList.add("list-style");
        ulEle.appendChild(liEle);
    }

    createListItem("Title: " + topic);
    createListItem("Duration: " + duration + " mins");
    createListItem("Questions: " + questions_count);
    createListItem("Correct Answer Marks: " + correct_answer_marks);
    createListItem("Negative Marks: " + negative_marks);
}

// Function to display the current question
function displayCurrentQuestion() {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < questionsData.length) {
        let question = questionsData[currentQuestionIndex];

        // Clearing previous question content
        currentQuestion.innerHTML = "";

        // Displaying the current question
        let h3Ele = document.createElement("h3");
        h3Ele.textContent = question.description;
        currentQuestion.appendChild(h3Ele);

        // Updating the question number
        questionNumber.textContent = currentQuestionIndex + 1;
    }
}

// Function to display options for the current question
function displayQuestionOptions() {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < questionsData.length) {
        let optionsIndex = optionsData[currentQuestionIndex];
        let optionsItem = optionsIndex.options;

        // Clearingprevious options
        optionsCont.innerHTML = "";

        // Displaying new options
        for (let each of optionsItem) {
            let listid = "uniqueNo" + each.id;

            // radio button
            let inputEle = document.createElement("input");
            inputEle.type = "radio";
            inputEle.id = listid;
            inputEle.name = "question" + currentQuestionIndex; // Ensure only one option can be selected at a time
            inputEle.value = each.id;

            //Restoring previous selection
            if (userAnswers[currentQuestionIndex] === each.id) {
                inputEle.checked = true;
            }

            inputEle.addEventListener("click", function () {
                userAnswers[currentQuestionIndex] = each.id;
                
            });

            optionsCont.appendChild(inputEle);

            // label for the radio button
            let labelELe = document.createElement("label");
            labelELe.textContent = each.description;
            labelELe.setAttribute("for", listid);
            labelELe.classList.add("options");
            optionsCont.appendChild(labelELe);

            // line break for spacing
            optionsCont.appendChild(document.createElement("br"));
        }
    }
}

// Function to navigate to the questions page
function questionpage() {
    home.style.display = "none";
    qns.style.display = "block";
    displayCurrentQuestion();
    displayQuestionOptions();
    updateButtons(); 
}

// Function to update button visibility
function updateButtons() {
    if (currentQuestionIndex === 0) {
        prevBtn.style.display = "none"; // Hide Previous button on the first question
    } else {
        prevBtn.style.display = "block"; 
    }

    if (currentQuestionIndex === questionsData.length - 1) {
        nextBtn.style.display = "none"; // Hide Next button on the last question
        submitBtn.style.display = "block"; // Show Submit button
    } else {
        nextBtn.style.display = "block"; 
        submitBtn.style.display = "none"; // Hide Submit button
    }
}

// Function to navigate to the previous question
function previous() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayCurrentQuestion();
        displayQuestionOptions();
        updateButtons();
    }
}

// Function to navigate to the next question
function next() {
    if (currentQuestionIndex < questionsData.length - 1) {
        currentQuestionIndex++;
        displayCurrentQuestion();
        displayQuestionOptions();
        updateButtons(); 
    }
}
function ValidateAns(){
    let score = 0;

    for (let i = 0; i < questionsData.length; i++) {
        let options = optionsData[i].options;
        let userAnswer = userAnswers[i];

        let correctAnswer = options.find(option => option.is_correct === true).id;
                    

        if (userAnswer === correctAnswer) {
            score += 4; 
        } else if (userAnswer !== undefined) {
            score -= 1; 
        }
       
    }
    return score;
}

// Function to submit the quiz
function submitQuiz() {

    let score = ValidateAns();

    qns.style.display = "none";
    res.style.display = "block";

    let h1res = document.createElement("h1");
    h1res.textContent = "You have submited successfully"
    rescon.appendChild(h1res);

    let resultDiv = document.createElement("h3");
    resultDiv.textContent = "Your score is: " + score +"/40";
    resultDiv.classList.add("result-style","text-success");
    rescon.appendChild(resultDiv)
}

// Event listeners
startBtn.addEventListener("click", questionpage);
prevBtn.addEventListener("click", previous);
nextBtn.addEventListener("click", next);
submitBtn.addEventListener("click", submitQuiz);

// Fetching data from the API
fetch("https://api.allorigins.win/raw?url=https://api.jsonserve.com/Uw5CrX")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        displayRules(data);
        questionsData = data.questions;
        optionsData = data.questions;
    })
    .catch(function (error) {
        console.error("Error fetching data: ", error);
    });