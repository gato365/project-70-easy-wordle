/*******************************************************
 * 📦 1. Load words from external file (optional)
 *******************************************************/
// Uncomment if you want to load from file instead of hardcoded words
// fetch('../five_letter_words.txt')
//   .then(response => response.text())
//   .then(text => {
//     allowedWords = text.split('\n').map(word => word.trim().toLowerCase());
//     shuffleWords();
//     console.log("Allowed words loaded and shuffled.");
//   })
//   .catch(error => console.error('Error loading allowed words:', error));


/*******************************************************
 * 🗂 2. Data & Initialization
 *******************************************************/
let words = [
  "beach", "coast", "horse", "learn",
  "nudge", "fiber", "mayor", "ghost",
  "lapel", "frack", "audio", "uncap"
];

// ✅ Add a list of allowed words (can be larger)
let allowedWords = [
  "beach", "coast", "horse", "learn", "nudge", "fiber", "mayor", "ghost",
  "lapel", "frack", "audio", "uncap",
  // add more real five-letter words as needed
];

words = words.map(word => word.toLowerCase());
allowedWords = allowedWords.map(word => word.toLowerCase());
shuffleWords();

let currentGuess = '';
let currentRow = 0;
let currentCol = 0;
let attempts = 6;
let currentWordIndex = 0;
let attemptsList = [];
let startTime, endTime;


/*******************************************************
 * ⚙️ 3. Event Listeners & User Input Handling
 *******************************************************/
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);

document.addEventListener('keydown', function (event) {
  if (attempts === 0 || currentRow >= 6) return; // Game over or finished rows

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

// New: Show/hide top menu when mouse near top
document.addEventListener('mousemove', function(e) {
  const topMenu = document.getElementById('topMenu');
  if (!topMenu) return; // safety check if element missing

  if (e.clientY <= 50) {
    topMenu.classList.add('visible');
  } else {
    topMenu.classList.remove('visible');
  }
});


/*******************************************************
 * 🔄 4. Utility Functions (shuffle, timer, etc.)
 *******************************************************/
function shuffleWords() {
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
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


/*******************************************************
 * 🎨 5. UI Creation & Update Functions
 *******************************************************/
function createBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';

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

function showSessionInfo() {
  document.getElementById('sessionInfo').style.display = 'block';
}

function updateSessionInfo(attemptsLeft, attemptsList) {
  const sessionInfo = document.getElementById('sessionInfo');
  const currentTime = new Date();
  const timeTaken = endTimer();
  const attemptsStr = attemptsList.join(', ');
  const userId = getUserId();

  // Append with line breaks, keep previous text too
  sessionInfo.textContent = "Congrats " + `${userId}` + "! 🎉";
}



/*******************************************************
 * 🚀 6. Game Control Functions (start, restart, end)
 *******************************************************/
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
  document.getElementById('sessionInfo').textContent = '';

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

function endGame(isWin) {
  document.getElementById('guessInput').disabled = true;
  document.getElementById('restartButton').style.display = 'block';
  showSessionInfo();
  updateSessionInfo(attempts, attemptsList);

  if (isWin) {
    celebrateWin();  // 🎉 confetti only, no alert
    // alert("🎉 You guessed it!");  <-- removed alert to avoid popup
  } else {
    alert(`❌ The correct word was "${words[currentWordIndex]}"`);
  }
}


/*******************************************************
 * ✅ 7. Game Logic (check guesses & update feedback)
 *******************************************************/
function submitGridGuess() {
  const guess = currentGuess.toLowerCase();
  if (guess.length !== 5) return;

  // ✅ Validate guess against allowedWords
  if (!allowedWords.includes(guess)) {
    alert("Not in word list!");
    return;
  }

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


/*******************************************************
 * 🎉 Confetti Celebration Function
 *******************************************************/
function celebrateWin() {
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 }
  });
}
