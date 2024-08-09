// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const User = require('./models/User');

const app = express();
const port = 5000;

// Connect to MongoDB
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/guessing-game');


app.use(cors());
app.use(bodyParser.json());

// Helper function to generate a random 4-digit number with unique digits
function generateUniqueNumber() {
  let digits = [];
  while (digits.length < 4) {
    const digit = Math.floor(Math.random() * 10).toString();
    if (!digits.includes(digit)) {
      digits.push(digit);
    }
  }
  return digits.join('');
}

// Start a new game
app.post('/api/start-game', async (req, res) => {
  try {
    const { name } = req.body;
    const secretNumber = generateUniqueNumber();
    const user = new User({ name, secretNumber, guesses: 0, bestScore: Infinity });

    await user.save();

    res.status(200).json({ secretNumber: secretNumber, message: 'Game started', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error starting game', error: error.message });
  }
});

// Check guess
app.post('/api/check-guess', async (req, res) => {
  try {
    const { userId, guess } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment the guess count
    user.guesses += 1;

    // Generate feedback for the guess
    let feedback = '';
    const secretDigits = user.secretNumber.split('');
    const guessDigits = guess.split('');

    guessDigits.forEach((digit, index) => {
      if (secretDigits[index] === digit) {
        feedback += '+';
      } else if (secretDigits.includes(digit)) {
        feedback += '-';
      }
    });

    // If the guess is correct, update the best score
    if (feedback === '++++') {
      user.bestScore = Math.min(user.bestScore, user.guesses);
      await user.save();
      return res.status(200).json({ message: 'Correct guess!', feedback, isCorrect: true });
    }

    // Save the updated user data
    await user.save();

    res.status(200).json({ feedback, isCorrect: false });
  } catch (error) {
    res.status(500).json({ message: 'Error checking guess', error: error.message });
  }
});

// Get best score
app.get('/api/best-score/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ bestScore: user.bestScore });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching best score', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
