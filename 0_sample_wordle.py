import random



# List of five-letter words
word_list = ['apple', 'alert', 'angle', 'baker', 'board', 'brain']

# Function to choose a random word from the list
def get_random_word(word_list):
    return random.choice(word_list)

# Function to play the Wordle-like game
def play_wordle(answer):
    print("Welcome to Wordle Clone!")
    attempts = 6
    while attempts > 0:
        guess = input("Enter your 5-letter word guess: ").lower()
        
        if len(guess) != 5:
            print("Please ensure your word is 5 letters long.")
            continue

        # Feedback logic
        feedback = ''
        for i in range(5):
            if guess[i] == answer[i]:
                feedback += '🟩'  # Green tile for correct letter and position
            elif guess[i] in answer:
                feedback += '🟨'  # Yellow tile for correct letter wrong position
            else:
                feedback += '⬛'  # Black tile for incorrect letter

        print(feedback)

        if guess == answer:
            print("Congratulations! You've guessed the word correctly!")
            break

        attempts -= 1
        print(f"You have {attempts} attempts left.")

    if attempts == 0:
        print(f"You've run out of attempts! The correct word was {answer}.")

# Select a random word as the answer
answer = get_random_word(word_list)

# Start the game
play_wordle(answer)
