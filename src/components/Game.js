'use client';

import { useEffect, useState, useCallback } from 'react';

export default function Game() {
  const [word, setWord] = useState('');
  const [anagrams, setAnagrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guess, setGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [error, setError] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const fetchGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsCorrect(null);
    setGuess('');
    setRevealed(false);

    const attemptFetch = async () => {
      try {
        // Fetch a random word
        const randomWordResponse = await fetch('https://random-word-api.vercel.app/api?words=1');
        if (!randomWordResponse.ok) throw new Error('Failed to fetch random word');
        const randomWordData = await randomWordResponse.json();
        const randomWord = randomWordData[0];

        // Fetch anagrams
        const uid = '13023';
        const tokenid = '6KoezMK9X3c1wQKT';
        const anagramApiUrl = `https://www.stands4.com/services/v2/ana.php?uid=${uid}&tokenid=${tokenid}&term=${randomWord}&format=json`;
        
        const anagramResponse = await fetch(anagramApiUrl);
        if (!anagramResponse.ok) throw new Error('Failed to fetch anagrams');
        
        const anagramResponseText = await anagramResponse.text();
        let anagramData = JSON.parse(anagramResponseText);

        if (!anagramData.result || !Array.isArray(anagramData.result) || anagramData.result.length === 0) {
          return attemptFetch(); // Retry if no anagrams found
        }

        const anagrams = anagramData.result.map(item => item.anagram.toLowerCase());

        setWord(randomWord.toLowerCase());
        setAnagrams(anagrams);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load game. Please try again.');
        setLoading(false);
      }
    };

    attemptFetch();
  }, []);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  useEffect(() => {
    if (isCorrect) {
      const timer = setTimeout(() => {
        fetchGame();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, fetchGame]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guess.trim()) return;
    
    if (guess.toLowerCase().trim() === word.toLowerCase()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleReveal = () => {
    setRevealed(true);
    setGuess(word);
    // We don't set isCorrect(true) here so the game doesn't auto-reload immediately,
    // allowing the user to see the word.
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8" aria-label="Loading game">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchGame}
          className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-md text-center border border-stone-100">
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Anagrams</h1>
      <p className="text-stone-500 mb-4">Unscramble the word!</p>
      <p className="text-stone-400 text-sm mb-8">
        Guess the word from the anagram clues below.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mb-8" aria-label="Anagram clues">
        {anagrams.slice(0, 6).map((anagram, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-orange-100 text-orange-800 rounded-xl font-medium text-lg shadow-sm border border-orange-200"
          >
            {anagram}
          </span>
        ))}
      </div>

      {revealed && (
        <div className="mb-6 text-orange-600 font-bold text-xl animate-pulse">
          The word is: {word}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <input
            type="text"
            id="guess-input"
            className="w-full p-4 text-center text-xl bg-stone-50 border-2 border-stone-200 rounded-2xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all text-stone-800 placeholder-stone-400"
            placeholder="Type your guess..."
            value={guess}
            onChange={(e) => {
              setGuess(e.target.value);
              if (isCorrect !== null) setIsCorrect(null);
            }}
            aria-label="Enter your guess"
            autoComplete="off"
            disabled={revealed || isCorrect}
          />
        </div>
        
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleReveal}
            disabled={revealed || isCorrect}
            className="flex-1 bg-stone-200 text-stone-600 font-bold py-3 px-6 rounded-xl hover:bg-stone-300 active:scale-95 transition-all"
          >
            Reveal
          </button>
          <button
            type="submit"
            disabled={revealed || isCorrect}
            className="flex-[2] bg-stone-800 text-white font-bold py-3 px-6 rounded-xl hover:bg-stone-700 active:scale-95 transition-all shadow-lg shadow-stone-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        </div>
      </form>

      <div aria-live="polite" className="min-h-[3rem] mb-6">
        {isCorrect === true && (
          <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-lg animate-bounce">
            <span>🎉</span> Correct! The word was {word}
          </div>
        )}
        {isCorrect === false && (
          <div className="text-rose-500 font-bold text-lg animate-shake">
            Not quite, try again!
          </div>
        )}
      </div>

      <button
        onClick={fetchGame}
        className="text-stone-400 hover:text-stone-600 font-medium text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        New Word
      </button>
    </div>
  );
}
