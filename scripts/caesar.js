// ---------------------
// Caesar Cipher
// ---------------------

export function caesarEncrypt(text, key) {
  const shift = parseInt(key) || 0;
  return text.replace(/[a-z]/gi, c => {
    const base = c >= 'a' && c <= 'z' ? 97 : 65;
    return String.fromCharCode((c.charCodeAt(0) - base + shift + 26) % 26 + base);
  });
}

export function caesarDecrypt(text, key) {
  const shift = parseInt(key) || 0;
  return caesarEncrypt(text, -shift);
}

export function generateRandomCaesarKey() {
  return Math.floor(Math.random() * 25) + 1; 
}
