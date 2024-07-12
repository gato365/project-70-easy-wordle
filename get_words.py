import nltk
nltk.download('words')

from nltk.corpus import words

# Get all English words
english_words = words.words()

# Filter for 5-letter words
five_letter_words = [word for word in english_words if len(word) == 5]

## Write 5 letters words to a file
with open('five_letter_words.txt', 'w') as file:
    for word in five_letter_words:
        file.write(word + '\n')


print(five_letter_words[:10])  # Print the first 10 words
