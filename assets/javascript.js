// // Fetch the text file located one directory up
// fetch('../five_letter_words.txt')
//   .then(response => {
//     // Check if the request was successful
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.text();
//   })
//   .then(text => {
//     // Split the text into an array of words
//     const words = text.split('\n');
//     // Generate a random index based on the number of words
//     const randomIndex = Math.floor(Math.random() * words.length);
//     // Select a random word and trim whitespace
//     const answer = words[randomIndex].trim();
//     // Example usage of the selected word
//     console.log(answer); // Log the answer to the console
//   })
//   .catch(error => {
//     // Log any errors that occur during the fetch operation
//     console.error('Error fetching the text file:', error);
//   });

const answer = "benny"; // For demonstration, typically fetched from server or generated
let attempts = 6;
// const answer = "benny"; // For demonstration, typically fetched from server or generated
// let attempts = 6;

function submitGuess() {
    let guess = document.getElementById('guessInput').value.toLowerCase();
    if (guess.length !== 5) {
        alert("Please ensure your word is 5 letters long.");
        return;
    }

    let feedback = "";
    let letterCounts = {};

    // Prepare letter counts from the answer
    for (let letter of answer) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }

    // First pass to assign green tiles
    for (let i = 0; i < 5; i++) {
        if (guess[i] === answer[i]) {
            feedback += '🟩'; // Green tile
            letterCounts[guess[i]] -= 1;
        } else {
            feedback += '⬛'; // Placeholder for now
        }
    }

    // Second pass for yellow tiles
    for (let i = 0; i < 5; i++) {
        if (feedback[i] === '⬛' && guess[i] in letterCounts && letterCounts[guess[i]] > 0) {
            feedback = feedback.substring(0, i) + '🟨' + feedback.substring(i + 1);
            letterCounts[guess[i]] -= 1;
        }
    }

    document.getElementById('feedback').textContent += feedback + "\n";
    attempts -= 1;
    document.getElementById('attemptsLeft').textContent = `You have ${attempts} attempts left.`;

    if (guess === answer) {
        alert("Congratulations! You've guessed the word correctly!");
        document.getElementById('guessInput').disabled = true;
    } else if (attempts === 0) {
        alert(`You've run out of attempts! The correct word was ${answer}.`);
        document.getElementById('guessInput').disabled = true;
    }

    document.getElementById('guessInput').value = ""; // Clear input field
}

document.getElementById('guessInput').addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        submitGuess();
    }
});
