import axios from 'axios';

export const translateText = async (text, targetLang, sourceLang = 'auto') => {
  try {
    const response = await axios.post('http://localhost:8000/api/translate', {
      text,
      target_lang: targetLang,
      source_lang: sourceLang
    });
    
    return response.data.translated_text;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Translation failed');
  }
}; 