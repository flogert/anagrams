// Utility function to validate the user's guess (optional: add more validation logic)
export const validateGuess = (guess) => {
    // Check if the guess is non-empty and a valid string (no numbers or special chars)
    const regex = /^[a-zA-Z]+$/;
    return regex.test(guess);
  };
  
  // Utility function for handling errors
  export const handleError = (error) => {
    console.error(error);
    return { message: 'Something went wrong. Please try again later.' };
  };
  
  // Utility function to display a success message (e.g., after a correct guess)
  export const displaySuccess = (message) => {
    return message || 'Great job! You guessed it correctly!';
  };
  
  // Utility function to display failure message (e.g., after an incorrect guess)
  export const displayFailure = (message) => {
    return message || 'Oops! That’s not correct. Try again!';
};
  