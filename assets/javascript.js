let words = [];
let attemptsList = []; // Initialize an empty list to store attempts
let attempts = 3;
let currentWordIndex = 0;
let startTime, endTime;


// Load the words into the game
fetch('../five_letter_words.txt')
  .then(response => response.text())
  .then(text => {
    words = text.split('\n').map(word => word.trim());
    shuffleWords();
    console.log("Words loaded and shuffled.");
  })
  .catch(error => console.error('Error loading words:', error));

// Function to shuffle the words array
function shuffleWords() {
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
}


function submitGuess() {
    let guess = document.getElementById('guessInput').value.toLowerCase();
    let answer = words[currentWordIndex];
    let feedback = calculateFeedback(guess, answer);
    
    // Display feedback
    document.getElementById('feedback').innerHTML = feedback;

    // Decrement attempts
    attempts--;
    document.getElementById('attemptsLeft').textContent = `You have ${attempts} attempts left.`;

    // Update attempted words display
    let attemptedWordsDiv = document.getElementById('attemptedWords');
    attemptedWordsDiv.textContent += guess + "\n";

    // Add the guess to the attempts list
    attemptsList.push(guess);


    // Clear the input field
    guessInput.value = '';

    // Check if the guess is correct or attempts are exhausted
    if (guess === answer) {
        alert("Congratulations! You've guessed the word correctly!");
        document.getElementById('guessInput').disabled = true;
        showSessionInfo();
        updateSessionInfo(attempts, attemptsList);
    } else if (attempts === 0) {
        alert(`You've run out of attempts! The correct word was ${answer}.`);
        document.getElementById('guessInput').disabled = true;
        showSessionInfo();
        updateSessionInfo(attempts, attemptsList);
    }
}
function calculateFeedback(guess, answer) {
    let feedback = "";
    let letterCounts = {};
    for (let letter of answer) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }
    for (let i = 0; i < 5; i++) {
        if (guess[i] === answer[i]) {
            feedback += '🟩';
            letterCounts[guess[i]] -= 1;
        } else {
            feedback += '⬛';
        }
    }
    for (let i = 0; i < 5; i++) {
        if (feedback[i] === '⬛' && guess[i] in letterCounts && letterCounts[guess[i]] > 0) {
            feedback = feedback.substring(0, i) + '🟨' + feedback.substring(i + 1);
            letterCounts[guess[i]] -= 1;
        }
    }
    return feedback;
}



function moveToNextWord() {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    attempts = 6;
    document.getElementById('feedback').innerHTML = "";
    document.getElementById('attemptedWords').innerHTML = "";
    document.getElementById('attemptsLeft').textContent = `You have ${attempts} attempts left.`;
}

document.getElementById('guessInput').addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        submitGuess();
    }
});



function updateSessionInfo(attemptsLeft, attemptsList) {
    let sessionInfo = document.getElementById('sessionInfo');
    let currentTime = new Date();
    let timeTaken = endTimer();
    let attemptsStr = attemptsList.join(', '); // Convert the list of attempts to a string
    sessionInfo.value += `Word: ${words[currentWordIndex]} - Attempts: ${6 - attemptsLeft} - Date: ${currentTime.toLocaleDateString()} - Time: ${currentTime.toLocaleTimeString()} - Duration: ${timeTaken} seconds - Sequence Number: ${currentWordIndex + 1} - Guesses: [${attemptsStr}]\n---\n`;
}

function showSessionInfo() {
    document.getElementById('sessionInfo').style.display = 'block'; // Make the textbox visible
}

function startTimer() {
    startTime = new Date();
}

function endTimer() {
    endTime = new Date();
    let timeDiff = endTime - startTime; // in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds 
    let seconds = Math.round(timeDiff);
    console.log("Time taken: " + seconds + " seconds");
    return seconds;
}