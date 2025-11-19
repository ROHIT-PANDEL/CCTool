const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';

// Generate random Monoalphabetic key (uppercase or lowercase)
export function generateMonoKey(caseType = 'upper') {
  const chars = (caseType === 'lower' ? LOWER : UPPER).split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

// Encrypt preserving original case
export function monoEncrypt(text, key) {
  const upperKey = key.toUpperCase();
  const lowerKey = key.toLowerCase();

  const mapUpper = {};
  const mapLower = {};
  for (let i = 0; i < 26; i++) {
    mapUpper[UPPER[i]] = upperKey[i];
    mapLower[LOWER[i]] = lowerKey[i];
  }

  return text.split('').map(c => {
    if (UPPER.includes(c)) return mapUpper[c];
    if (LOWER.includes(c)) return mapLower[c];
    return c;
  }).join('');
}

// Decrypt preserving original case
export function monoDecrypt(text, key) {
  const upperKey = key.toUpperCase();
  const lowerKey = key.toLowerCase();

  const reverseUpper = {};
  const reverseLower = {};
  for (let i = 0; i < 26; i++) {
    reverseUpper[upperKey[i]] = UPPER[i];
    reverseLower[lowerKey[i]] = LOWER[i];
  }

  return text.split('').map(c => {
    if (UPPER.includes(c)) return reverseUpper[c];
    if (LOWER.includes(c)) return reverseLower[c];
    return c;
  }).join('');
}
