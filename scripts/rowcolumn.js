// rowcolumn.js - Row-Transposition Cipher with proper handling for spaces, case, padding, and random key generation

/**
 * Encrypt text using Row-Column (Transposition) cipher
 * @param {string} text - Plaintext input
 * @param {string|number} key - Key string of digits (e.g., "3142")
 * @returns {string} Encrypted ciphertext
 */
export function rowEncrypt(text, key) {
  if (!text) return text;

  // Preserve case and remove spaces only
  const processedText = text.replace(/\s+/g, "");
  const keyStr = String(key);
  const cols = keyStr.length;
  const textLen = processedText.length;

  if (!keyStr || cols === 0) return processedText;

  const rows = Math.ceil(textLen / cols);        // Determine rows needed
  const gridSize = rows * cols;
  const paddingNeeded = gridSize - textLen;      // Calculate padding

  // Padding characters cycle
  const paddingChars = ['X', 'Y', 'Z'];
  let paddedText = processedText;
  for (let i = 0; i < paddingNeeded; i++) {
    paddedText += paddingChars[i % 3];
  }

  // Fill the grid row-wise
  const grid = Array.from({ length: rows }, () => Array(cols).fill(""));
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid[r][c] = paddedText[idx++];
    }
  }

  // Determine column read order from key (ascending order of key digits)
  const order = keyStr.split("").map((k, i) => ({ k: parseInt(k), i }))
                       .sort((a, b) => a.k - b.k);

  // Read columns in order to generate ciphertext
  let result = "";
  for (const { i } of order) {
    for (let r = 0; r < rows; r++) {
      result += grid[r][i];
    }
  }

  return result;
}

/**
 * Decrypt ciphertext using Row-Column (Transposition) cipher
 * @param {string} text - Ciphertext input
 * @param {string|number} key - Key string of digits (e.g., "3142")
 * @returns {string} Decrypted plaintext (with padding retained)
 */
export function rowDecrypt(text, key) {
  if (!text) return text;

  const processedText = text;  // Preserve case; spaces ignored in encryption
  const keyStr = String(key);
  const cols = keyStr.length;
  const textLen = processedText.length;

  if (!keyStr || cols === 0 || textLen === 0) return processedText;

  const rows = Math.ceil(textLen / cols);

  // Determine column write order from key
  const order = keyStr.split("").map((k, i) => ({ k: parseInt(k), i }))
                       .sort((a, b) => a.k - b.k);

  // Fill grid column-wise based on key order
  const grid = Array.from({ length: rows }, () => Array(cols).fill(""));
  let index = 0;
  for (const { i } of order) {
    for (let r = 0; r < rows; r++) {
      if (index < textLen) grid[r][i] = processedText[index++];
    }
  }

  // Flatten the grid row-wise to get decrypted text (padding retained)
  return grid.flat().join("");
}

/**
 * Generate a random Row-Transposition key
 * @returns {string} Random key as a string of unique digits (e.g., "3142")
 * Random key size is between 2–6 columns
 */
export function generateRandomRowKey() {
  const n = Math.floor(Math.random() * 5) + 2; // 2–6 columns
  const key = Array.from({ length: n }, (_, i) => i + 1);

  // Fisher-Yates shuffle
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [key[i], key[j]] = [key[j], key[i]];
  }

  return key.join('');
}
