export const playAudio = (text: string) => {
  if (!text) return;
  if (typeof window === 'undefined' || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    console.warn('Speech synthesis is not supported in this environment.');
    return;
  }
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('Failed to play audio:', error);
  }
};
