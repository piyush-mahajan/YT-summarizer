const { translate } = require('free-translate');

(async () => {
  try {
    // Example 1: Translating from English to Japanese
    const translatedText1 = await translate('Hello World', { from: 'en', to: 'te' });
    console.log('English to Japanese:', translatedText1); // こんにちは世界

    // Example 2: Auto-detecting the source language and translating to Spanish
    const translatedText2 = await translate('This is amazing!', { to: 'es' });
    console.log('Auto-detect to Spanish:', translatedText2); // ¡Esto es increíble!
  } catch (error) {
    console.error('Error during translation:', error.message);
  }
})();
