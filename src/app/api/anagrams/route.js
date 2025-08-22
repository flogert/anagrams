import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch a random word from the random-word API
    const randomWordResponse = await fetch('https://random-word-api.vercel.app/api?words=1');
    
    if (!randomWordResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch random word' }, { status: 500 });
    }

    const randomWordData = await randomWordResponse.json();

    if (!randomWordData || randomWordData.length === 0) {
      return NextResponse.json({ error: 'No random word found' }, { status: 500 });
    }

    const randomWord = randomWordData[0]; // Get the first random word

    // Get the uid and tokenid from environment variables
    const uid = process.env.ANAGRAMS_UID;
    const tokenid = process.env.ANAGRAMS_TOKENID;

    if (!uid || !tokenid) {
      return NextResponse.json({ error: 'Missing Anagram API credentials (uid or tokenid)' }, { status: 500 });
    }

    // Construct the Anagram API URL with the random word, uid, and tokenid
    const anagramApiUrl = `https://www.stands4.com/services/v2/ana.php?uid=${uid}&tokenid=${tokenid}&term=${randomWord}&format=json`;

    // Fetch anagrams for the random word from the Anagram API
    const anagramResponse = await fetch(anagramApiUrl);

    if (!anagramResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch anagrams' }, { status: 500 });
    }

    const anagramResponseText = await anagramResponse.text();

    // Try parsing the response only if it's valid JSON
    let anagramData = null;
    try {
      anagramData = JSON.parse(anagramResponseText);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON response from Anagram API' }, { status: 500 });
    }

    // Ensure the response contains 'result' and valid anagrams
    if (!anagramData.result || !Array.isArray(anagramData.result) || anagramData.result.length === 0) {
      return NextResponse.json({ error: 'No anagrams found for the word' }, { status: 500 });
    }

    // Extract anagrams from the result
    const anagrams = anagramData.result.map(item => item.anagram.toLowerCase());

    // Return the random word and its anagrams
    return NextResponse.json({
      word: randomWord.toLowerCase(),
      anagrams: anagrams
    });

  } catch (error) {
    console.error('Error in anagrams API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
