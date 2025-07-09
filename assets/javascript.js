

// //Load the words into the game
// fetch('../five_letter_words.txt')
//   .then(response => response.text())
//   .then(text => {
//     words = text.split('\n').map(word => word.trim());
//     shuffleWords();
//     console.log("Words loaded and shuffled.");
//   })
//   .catch(error => console.error('Error loading words:', error));

function createBoard() {
  const board = document.getElementById('board');
  board.innerHTML = ''; // Clear previous board

  for (let row = 0; row < 6; row++) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    for (let col = 0; col < 5; col++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.setAttribute('id', `tile-${row}-${col}`);
      rowDiv.appendChild(tile);
    }

    board.appendChild(rowDiv);
  }
}

let words = [
  "beach", "coast", "horse", "learn",
  "nudge", "fiber", "mayor", "ghost",
  "lapel", "frack", "audio", "uncap"
];

words = words.map(word => word.toLowerCase());
shuffleWords();

let currentGuess = '';
let currentRow = 0;
let currentCol = 0;
let attempts = 6;
let currentWordIndex = 0;
let attemptsList = [];
let startTime, endTime;

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);

document.addEventListener('keydown', function (event) {
  if (attempts === 0 || currentRow >= 6) return;

  const key = event.key.toLowerCase();

  if (key === 'backspace' && currentCol > 0) {
    currentCol--;
    currentGuess = currentGuess.slice(0, -1);
    document.getElementById(`tile-${currentRow}-${currentCol}`).textContent = '';
  } else if (/^[a-z]$/.test(key) && currentCol < 5) {
    document.getElementById(`tile-${currentRow}-${currentCol}`).textContent = key.toUpperCase();
    currentGuess += key;
    currentCol++;
  } else if (key === 'enter' && currentCol === 5) {
    submitGridGuess();
  }
});

function shuffleWords() {
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
}

function startGame() {
  attempts = 6;
  attemptsList = [];
  currentGuess = '';
  currentRow = 0;
  currentCol = 0;
  currentWordIndex = Math.floor(Math.random() * words.length);

  document.getElementById('startButton').style.display = 'none';
  document.getElementById('restartButton').style.display = 'none';
  document.getElementById('feedback').innerHTML = '';
  document.getElementById('sessionInfo').value = '';
  document.getElementById('attemptsLeft').textContent = `You have ${attempts} attempts left.`;
  document.getElementById('attemptedWords').innerHTML = '';
  document.getElementById('sessionInfo').style.display = 'none';
  document.getElementById('guessInput').disabled = false;

  createBoard();
  startTimer();
}

function restartGame() {
  document.getElementById('restartButton').style.display = 'none';
  document.getElementById('startButton').style.display = 'block';
  document.getElementById('board').innerHTML = '';
  document.getElementById('feedback').innerHTML = '';
  document.getElementById('attemptedWords').innerHTML = '';
  document.getElementById('attemptsLeft').textContent = '';
  document.getElementById('sessionInfo').style.display = 'none';
}

function submitGridGuess() {
  const guess = currentGuess.toLowerCase();
  if (guess.length !== 5) return;

  const answer = words[currentWordIndex];
  attemptsList.push(guess);

  const feedback = Array(5).fill('gray');
  const letterCounts = {};

  for (let letter of answer) {
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
  }

  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      feedback[i] = 'green';
      letterCounts[guess[i]]--;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (guess[i] !== answer[i] && letterCounts[guess[i]] > 0) {
      feedback[i] = 'yellow';
      letterCounts[guess[i]]--;
    }
  }

  for (let i = 0; i < 5; i++) {
    const tile = document.getElementById(`tile-${currentRow}-${i}`);
    tile.classList.add(feedback[i]);
  }

  attempts--;
  document.getElementById('attemptsLeft').textContent = `You have ${attempts} attempts left.`;

  if (guess === answer) {
    endGame(true);
  } else if (attempts === 0 || currentRow === 5) {
    endGame(false);
  } else {
    currentRow++;
    currentCol = 0;
    currentGuess = '';
  }
}

function endGame(isWin) {
  document.getElementById('guessInput').disabled = true;
  document.getElementById('restartButton').style.display = 'block';
  showSessionInfo();
  updateSessionInfo(attempts, attemptsList);

  if (isWin) {
    alert("🎉 You guessed it!");
  } else {
    alert(`❌ The correct word was "${words[currentWordIndex]}"`);
  }
}

function startTimer() {
  startTime = new Date();
}

function endTimer() {
  endTime = new Date();
  return Math.round((endTime - startTime) / 1000);
}

function getUserId() {
  return `user-${Math.floor(Math.random() * 1000000)}`;
}

function updateSessionInfo(attemptsLeft, attemptsList) {
  const sessionInfo = document.getElementById('sessionInfo');
  const currentTime = new Date();
  const timeTaken = endTimer();
  const attemptsStr = attemptsList.join(', ');
  const userId = getUserId();

  sessionInfo.value += `User ID: ${userId} - Word: ${words[currentWordIndex]} - Attempts: ${6 - attemptsLeft} - Date: ${currentTime.toLocaleDateString()} - Time: ${currentTime.toLocaleTimeString()} - Duration: ${timeTaken} seconds - Guesses: [${attemptsStr}]\n---\n`;
}

function showSessionInfo() {
  document.getElementById('sessionInfo').style.display = 'block';
}
