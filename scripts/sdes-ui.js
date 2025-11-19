import { sdesEncrypt, sdesDecrypt, generateKeys } from './sdes.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');
    const keyInput = document.getElementById('keyInput');
    const textInput = document.getElementById('textInput');
    const textLabel = document.getElementById('textLabel');
    const processBtn = document.getElementById('processBtn');
    const statusMessage = document.getElementById('statusMessage');
    const resultsContainer = document.getElementById('resultsContainer');
    const outputLabel = document.getElementById('outputLabel');
    const inputLabel = document.getElementById('inputLabel');

    // Current mode
    let currentMode = 'encrypt';

    // Mode selection buttons
    encryptBtn.addEventListener('click', () => {
        if (currentMode !== 'encrypt') {
            currentMode = 'encrypt';
            updateModeUI();
        }
    });

    decryptBtn.addEventListener('click', () => {
        if (currentMode !== 'decrypt') {
            currentMode = 'decrypt';
            updateModeUI();
        }
    });

    // Update UI based on selected mode
    function updateModeUI() {
        // Update button states
        encryptBtn.classList.toggle('active', currentMode === 'encrypt');
        decryptBtn.classList.toggle('active', currentMode === 'decrypt');
        
        // Update labels
        textLabel.textContent = currentMode === 'encrypt' ? 'Plaintext' : 'Ciphertext';
        processBtn.textContent = currentMode === 'encrypt' ? 'Encrypt' : 'Decrypt';
        inputLabel.textContent = currentMode === 'encrypt' ? 'Plaintext' : 'Ciphertext';
        outputLabel.textContent = currentMode === 'encrypt' ? 'Ciphertext' : 'Plaintext';
        
        // Update placeholder
        textInput.placeholder = `Enter 8-bit ${currentMode === 'encrypt' ? 'plaintext' : 'ciphertext'} (e.g., 10101010)`;
    }

    // Process button click handler
    processBtn.addEventListener('click', () => {
        const key = keyInput.value.trim();
        const text = textInput.value.trim();
        
        // Validate inputs
        if (!validateInputs(key, text)) {
            return;
        }
        
        // Show processing status
        statusMessage.style.display = 'block';
        resultsContainer.style.display = 'none';
        
        // Use setTimeout to allow the UI to update before processing
        setTimeout(() => {
            try {
                let result;
                if (currentMode === 'encrypt') {
                    result = sdesEncrypt(text, key);
                    displayResults(result, text, key);
                } else {
                    result = sdesDecrypt(text, key);
                    displayResults(result, text, key);
                }
                
                // Hide status message and show results
                statusMessage.style.display = 'none';
                resultsContainer.style.display = 'block';
                
                // Scroll to results
                resultsContainer.scrollIntoView({ behavior: 'smooth' });
            } catch (error) {
                statusMessage.textContent = 'Error: ' + error.message;
                statusMessage.style.display = 'block';
                resultsContainer.style.display = 'none';
            }
        }, 50);
    });

    // Validate inputs
    function validateInputs(key, text) {
        // Check key
        if (key.length !== 10) {
            alert('Key must be exactly 10 bits long');
            keyInput.focus();
            return false;
        }
        
        if (!/^[01]+$/.test(key)) {
            alert('Key must contain only 0s and 1s');
            keyInput.focus();
            return false;
        }
        
        // Check text
        if (text.length !== 8) {
            alert('Text must be exactly 8 bits long');
            textInput.focus();
            return false;
        }
        
        if (!/^[01]+$/.test(text)) {
            alert('Text must contain only 0s and 1s');
            textInput.focus();
            return false;
        }
        
        return true;
    }

    // Display results
    function displayResults(result, inputText, key) {
        // Key generation steps
        const keySteps = currentMode === 'encrypt' ? result.steps.keyGeneration : result.steps.keyGeneration;
        document.getElementById('initialKey').textContent = keySteps.initialKey;
        document.getElementById('afterP10').textContent = keySteps.afterP10;
        document.getElementById('leftHalf').textContent = keySteps.leftHalf;
        document.getElementById('rightHalf').textContent = keySteps.rightHalf;
        document.getElementById('afterLS1').textContent = keySteps.afterLS1;
        document.getElementById('k1').textContent = keySteps.K1;
        document.getElementById('afterLS2').textContent = keySteps.afterLS2;
        document.getElementById('k2').textContent = keySteps.K2;
        
        // Encryption/Decryption steps
        const processSteps = result.steps;
        document.getElementById('inputText').textContent = inputText;
        document.getElementById('afterIP').textContent = processSteps.initialPermutation;
        document.getElementById('ipLeft').textContent = processSteps.round1.initialLeft;
        document.getElementById('ipRight').textContent = processSteps.round1.initialRight;
        
        // Round 1
        document.getElementById('round1F').textContent = processSteps.round1.afterFunction;
        document.getElementById('round1XOR').textContent = processSteps.round1.afterXOR;
        document.getElementById('round1Left').textContent = processSteps.round1.newLeft;
        document.getElementById('round1Right').textContent = processSteps.round1.newRight;
        
        // Swap
        document.getElementById('swapLeft').textContent = processSteps.afterSwap.left;
        document.getElementById('swapRight').textContent = processSteps.afterSwap.right;
        
        // Round 2
        document.getElementById('round2F').textContent = processSteps.round2.afterFunction;
        document.getElementById('round2XOR').textContent = processSteps.round2.afterXOR;
        document.getElementById('round2Left').textContent = processSteps.round2.newLeft;
        document.getElementById('round2Right').textContent = processSteps.round2.newRight;
        
        // Final steps
        document.getElementById('beforeFP').textContent = processSteps.beforeFinalPermutation;
        document.getElementById('outputText').textContent = currentMode === 'encrypt' ? result.ciphertext : result.plaintext;
    }

    // Add input validation for key and text inputs
    keyInput.addEventListener('input', () => {
        keyInput.value = keyInput.value.replace(/[^01]/g, '');
    });
    
    textInput.addEventListener('input', () => {
        textInput.value = textInput.value.replace(/[^01]/g, '');
    });
});
