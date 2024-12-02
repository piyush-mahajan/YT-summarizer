export const translateText = async (text, targetLang) => {
  try {
    const encodedText = encodeURIComponent(text);
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodedText}`
    );
    
    const data = await response.json();
    return data[0].map(x => x[0]).join('');
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Translation failed');
  }
}; 