import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeypairService {

  async generateKeyPair() {
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: 'SHA-256',
        },
        true, // extractable
        ['encrypt', 'decrypt']
      );

      return keyPair;
    } catch (error) {
      console.error('Error generating key pair:', error);
      throw error;
    }
  }
  async exportPrivateKeyAsBase64(privateKey: CryptoKey): Promise<string> {
    const privateKeyArrayBuffer = await window.crypto.subtle.exportKey('pkcs8', privateKey);
    const privateKeyUint8Array = new Uint8Array(privateKeyArrayBuffer);
    const privateKeyBase64 = btoa(String.fromCharCode(...privateKeyUint8Array));
    return privateKeyBase64;
  }
  async importPrivateKeyFromBase64(privateKeyBase64: string): Promise<CryptoKey> {
    try {
      const privateKeyUint8Array = new Uint8Array(atob(privateKeyBase64).split('').map(char => char.charCodeAt(0)));
      const privateKeyArrayBuffer = privateKeyUint8Array.buffer;
      return await window.crypto.subtle.importKey(
        'pkcs8',
        privateKeyArrayBuffer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        true,
        ['decrypt']
      );
    } catch (error) {
      
      console.error('Error importing private key:', error);
      throw error;
    }
  }

}
