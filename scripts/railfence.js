/**
 * Encrypt text using Rail Fence cipher while preserving case
 */
export function railfenceEncrypt(text, key) {
  if (!text) return text;
  const numKey = parseInt(key);
  if (isNaN(numKey) || numKey < 2) return text;

  const rails = Array.from({ length: numKey }, () => []);
  let rail = 0, dir = 1;

  for (const char of text) {
    rails[rail].push(char);
    rail += dir;
    if (rail === 0 || rail === numKey - 1) dir *= -1;
  }

  return rails.map(r => r.join("")).join("");
}

/**
 * Decrypt text using Rail Fence cipher while preserving case
 */
export function railfenceDecrypt(text, key) {
  if (!text) return text;
  const numKey = parseInt(key);
  if (isNaN(numKey) || numKey < 2) return text;

  const len = text.length;
  const railPattern = [];
  let rail = 0, dir = 1;

  for (let i = 0; i < len; i++) {
    railPattern.push(rail);
    rail += dir;
    if (rail === 0 || rail === numKey - 1) dir *= -1;
  }

  const counts = Array(numKey).fill(0);
  for (let r of railPattern) counts[r]++;

  const rails = Array.from({ length: numKey }, () => []);
  let index = 0;
  for (let r = 0; r < numKey; r++) {
    rails[r] = text.slice(index, index + counts[r]).split("");
    index += counts[r];
  }

  let result = "";
  for (let r of railPattern) {
    if (rails[r].length > 0) result += rails[r].shift();
  }

  return result;
}

/**
 * Generate random Rail Fence key (2–5)
 */
export function generateRandomRailfenceKey() {
  const key = Math.floor(Math.random() * 4) + 2; // 2,3,4,5
  return key.toString();
}
