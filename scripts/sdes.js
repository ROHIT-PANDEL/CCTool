// Key Generation
function generateKeys(key) {
    if (key.length !== 10 || !/^[01]+$/.test(key)) {
        throw new Error("Key must be 10 bits (0s and 1s)");
    }

    const P10 = [2, 4, 1, 6, 3, 9, 0, 8, 7, 5];
    const P8 = [5, 2, 6, 3, 7, 4, 9, 8];

    let permutedKey = "";
    for (let i = 0; i < 10; i++) {
        permutedKey += key[P10[i]];
    }

    let leftHalf = permutedKey.substring(0, 5);
    let rightHalf = permutedKey.substring(5, 10);

    let leftShift1 = leftHalf.substring(1) + leftHalf[0];
    let rightShift1 = rightHalf.substring(1) + rightHalf[0];
    let combined1 = leftShift1 + rightShift1;

    let K1 = "";
    for (let i = 0; i < 8; i++) {
        K1 += combined1[P8[i]];
    }

    let leftShift2 = leftShift1.substring(2) + leftShift1.substring(0, 2);
    let rightShift2 = rightShift1.substring(2) + rightShift1.substring(0, 2);
    let combined2 = leftShift2 + rightShift2;

    let K2 = "";
    for (let i = 0; i < 8; i++) {
        K2 += combined2[P8[i]];
    }

    return {
        K1,
        K2,
        steps: {
            initialKey: key,
            afterP10: permutedKey,
            leftHalf,
            rightHalf,
            afterLS1: combined1,
            K1,
            afterLS2: combined2,
            K2
        }
    };
}

// S-DES Round Function
function round(leftHalf, rightHalf, subkey) {
    const EP = [3, 0, 1, 2, 1, 2, 3, 0];
    let expanded = "";
    for (let i = 0; i < 8; i++) {
        expanded += rightHalf[EP[i]];
    }   

    let xorResult = "";
    for (let i = 0; i < 8; i++) {
        xorResult += (expanded[i] === subkey[i]) ? "0" : "1";
    }

    let leftPart = xorResult.substring(0, 4);
    let rightPart = xorResult.substring(4, 8);

    const S0 = [
        ["01", "00", "11", "10"],
        ["11", "10", "01", "00"],
        ["00", "10", "01", "11"],
        ["11", "01", "11", "10"]
    ];
    const S1 = [
        ["00", "01", "10", "11"],
        ["10", "00", "01", "11"],
        ["11", "00", "01", "00"],
        ["10", "01", "00", "11"]
    ];

    let row0 = parseInt(leftPart[0] + leftPart[3], 2);
    let col0 = parseInt(leftPart[1] + leftPart[2], 2);
    let s0Output = S0[row0][col0];

    let row1 = parseInt(rightPart[0] + rightPart[3], 2);
    let col1 = parseInt(rightPart[1] + rightPart[2], 2);
    let s1Output = S1[row1][col1];

    let sBoxOutput = s0Output + s1Output;

    const P4 = [1, 3, 2, 0];
    let p4Output = "";
    for (let i = 0; i < 4; i++) {
        p4Output += sBoxOutput[P4[i]];
    }

    let xorWithLeft = "";
    for (let i = 0; i < 4; i++) {
        xorWithLeft += (leftHalf[i] === p4Output[i]) ? "0" : "1";
    }

    return {
        newLeft: xorWithLeft,
        newRight: rightHalf,
        fOutput: p4Output,
        xorOutput: xorWithLeft
    };
}

// S-DES Encryption
function sdesEncrypt(plaintext, key) {
    if (plaintext.length !== 8 || !/^[01]+$/.test(plaintext)) {
        throw new Error("Plaintext must be 8 bits (0s and 1s)");
    }

    const { K1, K2, steps: keySteps } = generateKeys(key);

    const IP = [1, 5, 2, 0, 3, 7, 4, 6];
    let permutedText = "";
    for (let i = 0; i < 8; i++) {
        permutedText += plaintext[IP[i]];
    }

    let leftHalf = permutedText.substring(0, 4);
    let rightHalf = permutedText.substring(4, 8);
    const initialLeft = leftHalf;
    const initialRight = rightHalf;

    // Round 1
    const round1Result = round(leftHalf, rightHalf, K1);
    let round1Left = round1Result.newLeft;
    let round1Right = round1Result.newRight;

    // Swap (Corrected: swap the original halves)
    leftHalf = initialRight;
    rightHalf = round1Result.newLeft;

    // Round 2
    const round2Result = round(leftHalf, rightHalf, K2);
    let preOutput = round2Result.newLeft + round2Result.newRight;

    const IPInverse = [3, 0, 2, 4, 6, 1, 7, 5];
    let ciphertext = "";
    for (let i = 0; i < 8; i++) {
        ciphertext += preOutput[IPInverse[i]];
    }

    return {
        ciphertext,
        steps: {
            keyGeneration: keySteps,
            initialPermutation: permutedText,
            round1: {
                input: { left: initialLeft, right: initialRight },
                afterFunction: round1Result.fOutput,
                afterXOR: round1Result.xorOutput,
                newLeft: round1Left,
                newRight: round1Right
            },
            afterSwap: {
                left: leftHalf,
                right: rightHalf
            },
            round2: {
                afterFunction: round2Result.fOutput,
                afterXOR: round2Result.xorOutput,
                newLeft: round2Result.newLeft,
                newRight: round2Result.newRight
            },
            preOutput,
            finalCiphertext: ciphertext
        }
    };
}

// S-DES Decryption
function sdesDecrypt(ciphertext, key) {
    if (ciphertext.length !== 8 || !/^[01]+$/.test(ciphertext)) {
        throw new Error("Ciphertext must be 8 bits (0s and 1s)");
    }

    const { K1, K2, steps: keySteps } = generateKeys(key);

    const IP = [1, 5, 2, 0, 3, 7, 4, 6];
    let permutedText = "";
    for (let i = 0; i < 8; i++) {
        permutedText += ciphertext[IP[i]];
    }

    let leftHalf = permutedText.substring(0, 4);
    let rightHalf = permutedText.substring(4, 8);
    const initialLeft = leftHalf;
    const initialRight = rightHalf;

    // Round 1 (with K2)
    const round1Result = round(leftHalf, rightHalf, K2);
    let round1Left = round1Result.newLeft;
    let round1Right = round1Result.newRight;

    // Swap (Corrected: swap the original halves)
    leftHalf = initialRight;
    rightHalf = round1Result.newLeft;

    // Round 2 (with K1)
    const round2Result = round(leftHalf, rightHalf, K1);
    let preOutput = round2Result.newLeft + round2Result.newRight;

    const IPInverse = [3, 0, 2, 4, 6, 1, 7, 5];
    let plaintext = "";
    for (let i = 0; i < 8; i++) {
        plaintext += preOutput[IPInverse[i]];
    }

    return {
        plaintext,
        steps: {
            keyGeneration: keySteps,
            initialPermutation: permutedText,
            round1: {
                input: { left: initialLeft, right: initialRight },
                afterFunction: round1Result.fOutput,
                afterXOR: round1Result.xorOutput,
                newLeft: round1Left,
                newRight: round1Right
            },
            afterSwap: {
                left: leftHalf,
                right: rightHalf
            },
            round2: {
                afterFunction: round2Result.fOutput,
                afterXOR: round2Result.xorOutput,
                newLeft: round2Result.newLeft,
                newRight: round2Result.newRight
            },
            preOutput,
            finalPlaintext: plaintext
        }
    };
}

// Export
export { sdesEncrypt, sdesDecrypt, generateKeys };
