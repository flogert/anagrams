export default async function handler(req, res) {
    try {
      // Fetch a random word from the random-word API
      const randomWordResponse = await fetch('https://random-word-api.vercel.app/api?words=1');
      
      if (!randomWordResponse.ok) {
        throw new Error('Failed to fetch random word');
      }
  
      const randomWordData = await randomWordResponse.json();
  
      if (!randomWordData || randomWordData.length === 0) {
        return res.status(500).json({ error: 'No random word found' });
      }
  
      const randomWord = randomWordData[0]; // Get the first random word
  
      // Get the uid and tokenid from environment variables
      const uid = process.env.ANAGRAMS_UID;
      const tokenid = process.env.ANAGRAMS_TOKENID;
  
      if (!uid || !tokenid) {
        return res.status(500).json({ error: 'Missing Anagram API credentials (uid or tokenid)' });
      }
  
      // Construct the Anagram API URL with the random word, uid, and tokenid
      const anagramApiUrl = `https://www.stands4.com/services/v2/ana.php?uid=${uid}&tokenid=${tokenid}&term=${randomWord}&format=json`;
  
      // Fetch anagrams for the random word from the Anagram API
      const anagramResponse = await fetch(anagramApiUrl);
  
      const anagramResponseText = await anagramResponse.text();
  
      if (!anagramResponse.ok) {
        throw new Error('Failed to fetch anagrams');
      }
  
      // Try parsing the response only if it's valid JSON
      let anagramData = null;
      try {
        anagramData = JSON.parse(anagramResponseText);
      } catch (error) {
        return res.status(500).json({ error: 'Invalid JSON response from Anagram API' });
      }
  
      // Ensure the response contains 'result' and valid anagrams
      if (!anagramData.result || !Array.isArray(anagramData.result) || anagramData.result.length === 0) {
        return res.status(500).json({ error: 'No anagrams found for the word' });
      }
  
      // Get the anagrams from the response
      const anagrams = anagramData.result.map(result => result.anagram);
  
      // Return the random word and its anagrams
      return res.status(200).json({ word: randomWord, anagrams });
  
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  