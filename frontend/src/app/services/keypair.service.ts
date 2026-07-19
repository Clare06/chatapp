import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeypairService {

  // Store the unlocked private key in memory for the duration of the session
  // It is never saved to localStorage in plaintext!
  public sessionPrivateKey: CryptoKey | null = null;

  async generateKeyPair() {
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: 'SHA-256',
        },
        true, // Must be extractable initially to encrypt it
        ['encrypt', 'decrypt']
      );

      return keyPair;
    } catch (error) {
      console.error('Error generating key pair:', error);
      throw error;
    }
  }

  // --- PBKDF2 Zero-Knowledge KEK Logic ---
  
  private async getPasswordKey(password: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
  }

  private async deriveAESKey(passwordKey: CryptoKey, salt: Uint8Array): Promise<CryptoKey> {
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      passwordKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async encryptPrivateKeyWithPassword(privateKey: CryptoKey, password: string): Promise<string> {
    // 1. Export the RSA Private Key to ArrayBuffer (PKCS8)
    const exportedPrivateKey = await window.crypto.subtle.exportKey('pkcs8', privateKey);

    // 2. Generate KEK using PBKDF2
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const passwordKey = await this.getPasswordKey(password);
    const aesKey = await this.deriveAESKey(passwordKey, salt);

    // 3. Encrypt the Private Key with AES-GCM
    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      aesKey,
      exportedPrivateKey
    );

    // 4. Combine Salt + IV + Ciphertext into a single Base64 string for easy storage
    const encryptedArray = new Uint8Array(encryptedContent);
    const payload = new Uint8Array(salt.length + iv.length + encryptedArray.length);
    payload.set(salt, 0);
    payload.set(iv, salt.length);
    payload.set(encryptedArray, salt.length + iv.length);

    // Convert to Base64 carefully to avoid stack limits
    let binary = '';
    payload.forEach((byte) => binary += String.fromCharCode(byte));
    return btoa(binary);
  }

  async decryptPrivateKeyWithPassword(encryptedBase64: string, password: string): Promise<CryptoKey> {
    // 1. Decode the Base64 string
    const binary = atob(encryptedBase64);
    const payload = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        payload[i] = binary.charCodeAt(i);
    }
    
    // 2. Extract Salt, IV, and Ciphertext
    const salt = payload.slice(0, 16);
    const iv = payload.slice(16, 28);
    const ciphertext = payload.slice(28);

    // 3. Derive KEK using PBKDF2
    const passwordKey = await this.getPasswordKey(password);
    const aesKey = await this.deriveAESKey(passwordKey, salt);

    // 4. Decrypt the Private Key
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      aesKey,
      ciphertext
    );

    // 5. Import back to CryptoKey
    return await window.crypto.subtle.importKey(
      'pkcs8',
      decryptedBuffer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false, // CRITICAL: false means no XSS can extract the plaintext key from memory!
      ['decrypt']
    );
  }
}
