import words from './words.js';

/**
 * Generate a single-word Playfair key based on input text case
 * @param {string} text - Input text (used to determine case)
 * @returns {string} Single-word key for Playfair cipher
 */
export function generatePlayfairKey(text) {
  const isUpperCase = text === text.toUpperCase();
  const word = words[Math.floor(Math.random() * words.length)];
  return isUpperCase ? word.toUpperCase() : word.toLowerCase();
}

/**
 * Create 5x5 Playfair matrix from a keyword
 * @param {string} key - Keyword for Playfair cipher
 * @returns {Array} 5x5 matrix
 */
export function getPlayfairMatrix(key) {
  const matrix = [];
  const usedChars = new Set();
  const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // I/J combined

  key = key.toUpperCase().replace(/J/g, 'I');

  // Add key letters
  for (let char of key) {
    if (!usedChars.has(char) && alphabet.includes(char)) {
      usedChars.add(char);
    }
  }

  // Add remaining letters
  for (let char of alphabet) {
    if (!usedChars.has(char)) {
      usedChars.add(char);
    }
  }

  const letters = Array.from(usedChars);
  for (let i = 0; i < 5; i++) {
    matrix.push(letters.slice(i * 5, i * 5 + 5));
  }

  return matrix;
}

/**
 * Encrypt plaintext using Playfair cipher
 * @param {string} plaintext 
 * @param {string} key 
 * @returns {string} Cipher text
 */
export function playfairEncrypt(plaintext, key) {
  const matrix = getPlayfairMatrix(key);
  let text = plaintext.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  let cipher = '';

  // Prepare digraphs
  for (let i = 0; i < text.length; i += 2) {
    let a = text[i];
    let b = text[i + 1] || 'X';
    if (a === b) b = 'X';
    const posA = findPosition(matrix, a);
    const posB = findPosition(matrix, b);

    if (posA[0] === posB[0]) {
      // Same row
      cipher += matrix[posA[0]][(posA[1] + 1) % 5];
      cipher += matrix[posB[0]][(posB[1] + 1) % 5];
    } else if (posA[1] === posB[1]) {
      // Same column
      cipher += matrix[(posA[0] + 1) % 5][posA[1]];
      cipher += matrix[(posB[0] + 1) % 5][posB[1]];
    } else {
      // Rectangle
      cipher += matrix[posA[0]][posB[1]];
      cipher += matrix[posB[0]][posA[1]];
    }
  }

  // Preserve original case
  if (key === key.toLowerCase()) cipher = cipher.toLowerCase();

  return cipher;
}

/**
 * Decrypt ciphertext using Playfair cipher
 * @param {string} cipherText 
 * @param {string} key 
 * @returns {string} Plain text
 */
export function playfairDecrypt(cipherText, key) {
  const matrix = getPlayfairMatrix(key);
  let text = cipherText.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  let plain = '';

  for (let i = 0; i < text.length; i += 2) {
    let a = text[i];
    let b = text[i + 1] || 'X';
    const posA = findPosition(matrix, a);
    const posB = findPosition(matrix, b);

    if (posA[0] === posB[0]) {
      plain += matrix[posA[0]][(posA[1] + 4) % 5];
      plain += matrix[posB[0]][(posB[1] + 4) % 5];
    } else if (posA[1] === posB[1]) {
      plain += matrix[(posA[0] + 4) % 5][posA[1]];
      plain += matrix[(posB[0] + 4) % 5][posB[1]];
    } else {
      plain += matrix[posA[0]][posB[1]];
      plain += matrix[posB[0]][posA[1]];
    }
  }

  if (key === key.toLowerCase()) plain = plain.toLowerCase();

  return plain;
}

/**
 * Helper: Find letter position in Playfair matrix
 */
function findPosition(matrix, char) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (matrix[i][j] === char) return [i, j];
    }
  }
  return null;
}
