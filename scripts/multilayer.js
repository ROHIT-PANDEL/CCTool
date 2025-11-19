// multilayer.js
// Handles multilayer encryption/decryption for all ciphers
// Receives 'methods' object from script.js for access to each cipher

/**
 * Process multilayer encryption or decryption
 * @param {string} text - Input text
 * @param {Array} layers - Array of objects: [{algorithm: "caesar", key: "3"}, ...]
 * @param {string} mode - "encrypt" or "decrypt"
 * @param {Object} methods - Cipher methods from script.js {caesar: {encrypt, decrypt}, ...}
 * @returns {string} - Result after processing all layers
 */
export function multiLayerProcess(text, layers, mode, methods) {
  if (!text || !layers || !layers.length) return text;

  let result = text;

  // If decrypt, reverse the layers order
  const ops = mode === 'encrypt' ? layers : layers.slice().reverse();

  for (const { algorithm, key } of ops) {
    const method = methods[algorithm];
    if (!method) {
      console.error(`Algorithm "${algorithm}" not found in provided methods.`);
      throw new Error(`Algorithm "${algorithm}" not supported in multilayer processing.`);
    }

    let parsedKey = key;

    // Specific key parsing for certain algorithms
    if (algorithm === 'caesar' || algorithm === 'railfence') {
      parsedKey = parseInt(key);
      if (isNaN(parsedKey)) {
        throw new Error(`Invalid key "${key}" for ${algorithm} cipher.`);
      }
      if (algorithm === 'railfence' && (parsedKey < 2 || !Number.isInteger(parsedKey))) {
        throw new Error(`Invalid key "${key}" for Rail Fence cipher.`);
      }
    }

    try {
      result = method[mode](result, parsedKey);
    } catch (error) {
      console.error(`Error during ${mode}ion with ${algorithm}:`, error);
      throw new Error(`Error in layer ${algorithm}: ${error.message}`);
    }
  }

  return result;
}
