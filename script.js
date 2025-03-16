const quoteDisplay = document.getElementById("quote");
const textInput = document.getElementById("input");
const startBtn = document.getElementById("start-btn");
const timeDisplay = document.getElementById("time");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const progressBar = document.getElementById("progress");

let timer = 60;
let timerInterval;
let quoteText = "";
let correctChars = 0;
let totalChars = 0;

// Fetch a random quote
async function fetchQuote() {
    const response = await fetch("texts.json");
    const texts = await response.json();
    quoteText = texts[Math.floor(Math.random() * texts.length)];
    quoteDisplay.textContent = quoteText;
}

// Start the test
function startTest() {
    startBtn.disabled = true;
    textInput.disabled = false;
    textInput.focus();
    textInput.value = "";
    correctChars = 0;
    totalChars = 0;
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100";
    timeDisplay.textContent = "60";
    progressBar.style.width = "100%";
    timer = 60;

    fetchQuote();
    
    timerInterval = setInterval(() => {
        if (timer > 0) {
            timer--;
            timeDisplay.textContent = timer;
            progressBar.style.width = `${(timer / 60) * 100}%`;
            updateStats();
        } else {
            endTest();
        }
    }, 1000);
}

// Update WPM and Accuracy
function updateStats() {
    const wordsTyped = textInput.value.trim().split(" ").length;
    const timeElapsed = 60 - timer;
    const wpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
    wpmDisplay.textContent = wpm;

    const typedArray = textInput.value.split("");
    const quoteArray = quoteText.split("");

    correctChars = typedArray.filter((char, index) => char === quoteArray[index]).length;
    totalChars = typedArray.length;
    
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    accuracyDisplay.textContent = accuracy;
}

// End test
function endTest() {
    clearInterval(timerInterval);
    textInput.disabled = true;
    startBtn.disabled = false;
}

// Event Listeners
startBtn.addEventListener("click", startTest);
textInput.addEventListener("input", updateStats);
