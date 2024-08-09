

import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

const Game = () => {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [secretNumber, setSecretNumber] = useState('');
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [guessCount, setGuessCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [bestScore, setBestScore] = useState(null);

  // State to control the popup visibility
  const [showPopup, setShowPopup] = useState(false);

  const startNewGame = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/start-game', { name });
      setSecretNumber(response.data.secretNumber);
      setUserId(response.data.userId);
      setGuessCount(0);
      setFeedback('');
      setGameStarted(true);
      setIsCorrect(false);
      setBestScore(null);
      setGuess('');
    } catch (error) {
      console.error('Error starting game:', error.message);
    }
  };

  const handleGuess = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/check-guess', {
        userId,
        guess,
      });

      setGuessCount((prevCount) => prevCount + 1);
      setFeedback(response.data.feedback);

      if (response.data.isCorrect) {
        setIsCorrect(true);
        await fetchBestScore();
        setShowPopup(true); // Show popup on correct guess
      } else {
        setGuess(''); // Clear input if incorrect
      }
    } catch (error) {
      console.error('Error checking guess:', error.message);
    }
  };

  const fetchBestScore = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/best-score/${userId}`);
      setBestScore(response.data.bestScore);
    } catch (error) {
      console.error('Error fetching best score:', error.message);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="game-container">
      {!gameStarted ? (
        <div className="start-game">
          <h1>Guessing Game</h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={startNewGame}>Start Game</button>
        </div>
      ) : (
        <div className="game">
          <h2>Hello, {name}!</h2>
          <p>Enter your guess (4 unique digits):</p>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <button onClick={handleGuess}>Submit Guess</button>
          <p>Feedback: {feedback}</p>
          <p>Number of Guesses: {guessCount}</p>
          {isCorrect && (
            <div className="congratulations">
              <h3>Congratulations! You've guessed the number!</h3>
              <p>Your Best Score: {bestScore}</p>
            </div>
          )}
        </div>
      )}

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Congratulations!</h3>
            <p>You've successfully completed the game.</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
