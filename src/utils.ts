
import CryptoJS, { AES, enc, pad } from 'crypto-js';

// Function to derive a key using PBKDF2
const deriveKey = (password: string, salt: CryptoJS.lib.WordArray, iterations: number, keySize: number) => {
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: keySize / 32, // Key size in words
    iterations: iterations,
    hasher: CryptoJS.algo.SHA256,
  });
  return key;
};

// ...

// Generate a random salt
const salt = CryptoJS.lib.WordArray.random(16);

// Derive a key using PBKDF2
const password: string = "PetNFC1234";
const iterations: number = 100000;
const keySize: number = 256; // Key size in bits


let derived: CryptoJS.lib.WordArray;

// Check if the derived key is already stored in session storage
const storedDerivedKey = sessionStorage.getItem('derivedKey');
if (storedDerivedKey) {
  derived = CryptoJS.enc.Hex.parse(storedDerivedKey);
} else {
  // If not, derive the key and store it in session storage
  derived = deriveKey(password, salt, iterations, keySize);
  sessionStorage.setItem('derivedKey', CryptoJS.enc.Hex.stringify(derived));
}

export const encrypt = (plaintext: string): string => {
    // Generate a random IV
    const iv = CryptoJS.lib.WordArray.random(128 / 8); // 16 bytes
    
    // Encrypt using AES in CBC mode
    const encrypted = AES.encrypt(
      CryptoJS.enc.Utf8.parse(plaintext),
      derived, // Use the derived key directly
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
  
    // Combine IV and ciphertext, then encode as URL-safe base64
    const ciphertext = encodeURIComponent(CryptoJS.enc.Base64.stringify(iv.concat(encrypted.ciphertext)));
    return ciphertext;
};

export const decrypt = (ciphertext: string): string => {
    // Decode the URL-safe base64 string
    const decodedCiphertext = CryptoJS.enc.Base64.parse(decodeURIComponent(ciphertext));
  
    // Extract IV and ciphertext
    const iv = CryptoJS.lib.WordArray.create(decodedCiphertext.words.slice(0, 4));
    const encryptedText = CryptoJS.lib.WordArray.create(decodedCiphertext.words.slice(4));
  
    // Decrypt using AES in CBC mode
    const decrypted = AES.decrypt(
      {
        ciphertext: encryptedText,
      } as CryptoJS.lib.CipherParams,
      derived, // Use the derived key directly
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
  
    // Convert the decrypted data to a UTF-8 string
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
    return plaintext;
};
