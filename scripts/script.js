import { caesarEncrypt, caesarDecrypt, generateRandomCaesarKey } from './caesar.js';
import { monoEncrypt, monoDecrypt, generateMonoKey } from './monoalphabetic.js';
import { playfairEncrypt, playfairDecrypt, getPlayfairMatrix, generatePlayfairKey } from './playfair.js';
import { vigenereEncrypt, vigenereDecrypt, generateRandomVigenereKey } from './vigenere.js';
import { railfenceEncrypt as railFenceEncrypt, railfenceDecrypt as railFenceDecrypt, generateRandomRailfenceKey } from './railfence.js';
import { rowEncrypt as rowColumnEncrypt, rowDecrypt as rowColumnDecrypt, generateRandomRowKey } from './rowcolumn.js';
import { multiLayerProcess } from './multilayer.js';

// ----------------------- DOM Elements -----------------------
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const encryptBtn = document.getElementById('encryptBtn');
const decryptBtn = document.getElementById('decryptBtn');
const algoSelect = document.getElementById('algo');
const keyInputDiv = document.getElementById('keyInputDiv');
const keyInput = document.getElementById('keyInput');
const generateKeyBtn = document.getElementById('generateKey');
const multiLayerCheckbox = document.getElementById('multiLayer');
const singleLayerContainer = document.getElementById('singleLayerContainer');
const layersContainer = document.getElementById('layersContainer');
const processBtn = document.getElementById('processBtn');
const matrixDisplay = document.getElementById('matrixDisplay');
const playfairMatrix = document.getElementById('playfairMatrix');

let currentMode = 'encrypt';
const MAX_LAYERS = 3;

// ----------------------- Algorithm Info -----------------------
const algorithmsInfo = {
  caesar: { needsKey: true, generateKey: true, keyPlaceholder: 'Enter a number (shift)' },
  mono: { needsKey: true, generateKey: true, keyPlaceholder: '26 letters key (A-Z or a-z)' },
  playfair: { needsKey: true, generateKey: true, keyPlaceholder: 'Keyword (letters only)' },
  vigenere: { needsKey: true, generateKey: true, keyPlaceholder: 'Keyword (letters only)' },
  railfence: { needsKey: true, generateKey: true, keyPlaceholder: 'Number of rails (≥2)' },
  rowcolumn: { needsKey: true, generateKey: true, keyPlaceholder: 'Numbers only (e.g., 312)' },
};

// ----------------------- Cipher Methods -----------------------
const cipherMethods = {
  caesar: { encrypt: caesarEncrypt, decrypt: caesarDecrypt },
  mono: { encrypt: monoEncrypt, decrypt: monoDecrypt },
  playfair: { encrypt: playfairEncrypt, decrypt: playfairDecrypt },
  vigenere: { encrypt: vigenereEncrypt, decrypt: vigenereDecrypt },
  railfence: { encrypt: railFenceEncrypt, decrypt: railFenceDecrypt },
  rowcolumn: { encrypt: rowColumnEncrypt, decrypt: rowColumnDecrypt },
};

// ----------------------- Utility Functions -----------------------
function highlightField(field, valid) {
  if (!field) return;
  if (valid) {
    field.classList.remove('invalid');
    field.classList.add('valid');
  } else {
    field.classList.remove('valid');
    field.classList.add('invalid');
  }
}

function validateTextField(field, fieldName) {
  if (!field || !field.value.trim()) {
    highlightField(field, false);
    alert(`${fieldName} cannot be empty`);
    return false;
  } else {
    highlightField(field, true);
    return true;
  }
}

// ----------------------- Mode Button Handlers -----------------------
encryptBtn.addEventListener('click', () => {
  currentMode = 'encrypt';
  encryptBtn.classList.add('active');
  decryptBtn.classList.remove('active');
});

decryptBtn.addEventListener('click', () => {
  currentMode = 'decrypt';
  decryptBtn.classList.add('active');
  encryptBtn.classList.remove('active');
});

// ----------------------- Key Validation -----------------------
function validateKey(algo, key) {
  switch (algo) {
    case 'caesar':
      if (isNaN(parseInt(key))) return false;
      return true;
    case 'mono':
      if (!/^[A-Za-z]{26}$/.test(key)) return false;
      if ((new Set(key.toUpperCase().split(''))).size !== 26) return false;
      return true;
    case 'vigenere':
    case 'playfair':
      if (!/^[A-Za-z]+$/.test(key)) return false;
      return true;
    case 'railfence':
      const num = parseInt(key);
      if (isNaN(num) || num < 2) return false;
      return true;
    case 'rowcolumn':
      if (!/^\d+$/.test(key)) return false;
      return true;
    default:
      return true;
  }
}

// ----------------------- Algorithm Selection -----------------------
algoSelect.addEventListener('change', () => {
  const algo = algoSelect.value;
  matrixDisplay.style.display = 'none';
  if (!algo) { keyInputDiv.style.display = 'none'; generateKeyBtn.style.display = 'none'; return; }

  keyInputDiv.style.display = 'block';
  keyInput.placeholder = algorithmsInfo[algo].keyPlaceholder;
  keyInput.value = '';
  generateKeyBtn.style.display = algorithmsInfo[algo].generateKey ? 'inline-block' : 'none';
});

// ----------------------- Random Key Generation -----------------------
generateKeyBtn.addEventListener('click', () => {
  const algo = algoSelect.value;
  const text = inputText.value.trim();
  if (!algo || !text) { alert('Select algorithm and enter text first'); return; }

  switch (algo) {
    case 'caesar':
      keyInput.value = generateRandomCaesarKey();
      break;
    case 'mono':
      keyInput.value = generateMonoKey(/[a-z]/.test(text) ? 'lower' : 'upper');
      break;
    case 'vigenere':
      keyInput.value = generateRandomVigenereKey(text);
      break;
    case 'playfair':
      keyInput.value = generatePlayfairKey(text);
      break;
    case 'railfence':
      keyInput.value = generateRandomRailfenceKey();
      break;
    case 'rowcolumn':
      keyInput.value = generateRandomRowKey();
      break;
  }
  highlightField(keyInput, true);
});

// ----------------------- Run Cipher -----------------------
function runCipher(algo, mode, text, key) {
  if (!algo) return text;
  switch (algo) {
    case 'caesar':
      return mode==='encrypt'? caesarEncrypt(text, parseInt(key)) : caesarDecrypt(text, parseInt(key));
    case 'mono':
      return mode==='encrypt'? monoEncrypt(text, key) : monoDecrypt(text, key);
    case 'playfair': 
      const matrix = getPlayfairMatrix(key);
      matrixDisplay.style.display = 'block';
      playfairMatrix.textContent = matrix.map(r=>r.join(' ')).join('\n');
      return mode==='encrypt'? playfairEncrypt(text,key):playfairDecrypt(text,key);
    case 'vigenere':
      return mode==='encrypt'? vigenereEncrypt(text,key):vigenereDecrypt(text,key);
    case 'railfence':
      return mode==='encrypt'? railFenceEncrypt(text,key):railFenceDecrypt(text,key);
    case 'rowcolumn':
      return mode==='encrypt'? rowColumnEncrypt(text,key):rowColumnDecrypt(text,key);
    default:
      return text;
  }
}

// ----------------------- Multi-layer Setup -----------------------
multiLayerCheckbox.addEventListener('change', () => {
  if (multiLayerCheckbox.checked) {
    singleLayerContainer.style.display = 'none';
    layersContainer.style.display = 'block';
    layersContainer.innerHTML = '';

    for (let i = 1; i <= MAX_LAYERS; i++) {
      const layerDiv = document.createElement('div');
      layerDiv.className = 'layer';
      layerDiv.innerHTML = `
        <label>Layer ${i} Algorithm:</label>
        <select class="layer-algo" data-layer="${i}">
          <option value="">--Select--</option>
          <option value="caesar">Caesar Cipher</option>
          <option value="mono">Monoalphabetic Cipher</option>
          <option value="playfair">Playfair Cipher</option>
          <option value="vigenere">Vigenère Cipher</option>
          <option value="railfence">Rail Fence Cipher</option>
          <option value="rowcolumn">Row-Column Transposition</option>
        </select>
        <div class="layerKeyDiv">
          <label>Key:</label>
          <input type="text" class="layer-key" data-layer="${i}" placeholder="Enter key..." />
          <button type="button" class="generateLayerKeyBtn" data-layer="${i}">Generate Key</button>
        </div>
      `;
      layersContainer.appendChild(layerDiv);
    }

    // Event listeners for generate key buttons
    document.querySelectorAll('.generateLayerKeyBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const layer = e.target.dataset.layer;
        const layerAlgo = document.querySelector(`.layer-algo[data-layer="${layer}"]`).value;
        const keyInputField = document.querySelector(`.layer-key[data-layer="${layer}"]`);
        const text = inputText.value.trim();
        if (!layerAlgo || !text) { alert('Select algorithm and enter text first'); return; }

        switch (layerAlgo) {
          case 'caesar':
            keyInputField.value = generateRandomCaesarKey(); break;
          case 'mono':
            keyInputField.value = generateMonoKey(/[a-z]/.test(text) ? 'lower' : 'upper'); break;
          case 'vigenere':
            keyInputField.value = generateRandomVigenereKey(text); break;
          case 'playfair':
            keyInputField.value = generatePlayfairKey(text); break;
          case 'railfence':
            keyInputField.value = generateRandomRailfenceKey(); break;
          case 'rowcolumn':
            keyInputField.value = generateRandomRowKey(); break;
        }
        highlightField(keyInputField, true);
      });
    });

  } else {
    singleLayerContainer.style.display = 'block';
    layersContainer.style.display = 'none';
  }
});

// ----------------------- Process Button -----------------------
processBtn.addEventListener('click', () => {
  const text = inputText.value.trim();
  if (!validateTextField(inputText, 'Input text')) return;

  if (multiLayerCheckbox.checked) {
    const layers = [];
    for (let i = 1; i <= MAX_LAYERS; i++) {
      const layerAlgo = document.querySelector(`.layer-algo[data-layer="${i}"]`).value;
      const layerKey = document.querySelector(`.layer-key[data-layer="${i}"]`).value.trim();

      if (!layerAlgo) { alert(`Select algorithm for Layer ${i}`); return; }
      if (!layerKey) { alert(`Enter key for Layer ${i}`); return; }
      if (!validateKey(layerAlgo, layerKey)) { alert(`Invalid key for Layer ${i}`); return; }

      layers.push({ algorithm: layerAlgo, key: layerKey });
    }

    try {
      outputText.value = multiLayerProcess(text, layers, currentMode, cipherMethods);
    } catch (err) {
      alert('Error: ' + err.message);
    }

  } else {
    const algo = algoSelect.value;
    const key = keyInput.value.trim();

    if (!algo) { alert('Select an algorithm'); return; }
    if (algorithmsInfo[algo].needsKey && !key) { alert('Key required'); highlightField(keyInput, false); return; }
    if (!validateKey(algo, key)) { alert('Invalid key'); highlightField(keyInput, false); return; }

    highlightField(keyInput, true);
    outputText.value = runCipher(algo, currentMode, text, key);
  }
});
