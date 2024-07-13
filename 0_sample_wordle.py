import random



# List of five-letter words
with open("five_letter_words.txt", "r") as file:
    word_list = [word.strip().lower() for word in file]
# word_list = ['apple', 'alert', 'angle', 'baker', 'board', 'brain']

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

        # Count occurrences of each letter in the answer
        letter_counts = {}
        for letter in answer:
            if letter in letter_counts:
                letter_counts[letter] += 1
            else:
                letter_counts[letter] = 1

        # Feedback logic with letter frequency considered
        feedback = ''
        for i in range(5):
            if guess[i] == answer[i]:
                feedback += '🟩'  # Green tile for correct letter and position
                letter_counts[guess[i]] -= 1  # Deduct the count for correct guesses
            else:
                feedback += '⬛'  # Placeholder for now

        # Second pass for yellow tiles, to ensure correct count handling
        for i in range(5):
            if feedback[i] == '⬛' and guess[i] in answer and letter_counts[guess[i]] > 0:
                feedback = feedback[:i] + '🟨' + feedback[i+1:]  # Yellow tile for correct letter, wrong position
                letter_counts[guess[i]] -= 1

        print(feedback)

        if guess == answer:
            print("Congratulations! You've guessed the word correctly!")
            break

        attempts -= 1
        print(f"You have {attempts} attempts left.")

    if attempts == 0:
        print(f"You've run out of attempts! The correct word was {answer}.")

# Select a random word as the answer
answer = "benny" #get_random_word(word_list)

# Start the game
play_wordle(answer)
