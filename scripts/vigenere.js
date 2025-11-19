import words from './words.js';

/**
 * Generate a readable single-word random key for Vigenère cipher
 * @param {string} text - Input text (used to determine case)
 * @returns {string} Single-word readable key
 */
export function generateRandomVigenereKey(text) {
  const isUpperCase = text === text.toUpperCase();
  const word = words[Math.floor(Math.random() * words.length)];
  return isUpperCase ? word.toUpperCase() : word.toLowerCase();
}

/**
 * Encrypt text using Vigenère cipher
 */
export function vigenereEncrypt(plainText, key) {
  let cipherText = '';
  let keyIndex = 0;

  for (let char of plainText) {
    const isUpper = char >= 'A' && char <= 'Z';
    const isLower = char >= 'a' && char <= 'z';

    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97;
      const p = char.charCodeAt(0) - base;
      const k = key[keyIndex % key.length].toUpperCase().charCodeAt(0) - 65;
      cipherText += String.fromCharCode((p + k) % 26 + base);
      keyIndex++;
    } else {
      cipherText += char;
    }
  }

  return cipherText;
}

/**
 * Decrypt text using Vigenère cipher
 */
export function vigenereDecrypt(cipherText, key) {
  let plainText = '';
  let keyIndex = 0;

  for (let char of cipherText) {
    const isUpper = char >= 'A' && char <= 'Z';
    const isLower = char >= 'a' && char <= 'z';

    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97;
      const c = char.charCodeAt(0) - base;
      const k = key[keyIndex % key.length].toUpperCase().charCodeAt(0) - 65;
      plainText += String.fromCharCode((c - k + 26) % 26 + base);
      keyIndex++;
    } else {
      plainText += char;
    }
  }

  return plainText;
}
