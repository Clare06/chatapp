import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User, db } from 'src/app/indexdb/db';
import { KeypairService } from 'src/app/services/keypair.service';

@Component({
  selector: 'app-keystore',
  templateUrl: './keystore.component.html',
  styleUrls: ['./keystore.component.css']
})
export class KeystoreComponent {
  set: boolean = false;
  errr: string = "";
  constructor(private route: ActivatedRoute, private keyPair: KeypairService){

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      console.log(params['privateKey']);
      console.log(params['username']);
      const queryKey=params['privateKey'];
      const decodedPrivateKey = decodeURIComponent(queryKey);
      const privateKey = await this.importPrivateKeyFromPEM(decodedPrivateKey);


      const privateKeyBase64 = await this.keyPair.exportPrivateKeyAsBase64(privateKey);
            const dbuser: User = {
              user: params['username'],
              hiddenInfo: {
                encryptedPrivateKey: privateKeyBase64,
              },
            }
            await db.addUserWithPrivateKey(dbuser).then(() => {
              this.set=true;
            }).catch((err) => {
              this.errr=err;
            });


    });

  }

  async importPrivateKeyFromPEM(pemPrivateKey: string): Promise<CryptoKey> {
    try {
      // Decode the base64-encoded PEM contents into a binary string.
      const binaryDer = atob(pemPrivateKey);
      const privateKeyBuffer = new Uint8Array(binaryDer.length);
      for (let i = 0; i < binaryDer.length; i++) {
        privateKeyBuffer[i] = binaryDer.charCodeAt(i);
      }

      // Import the binary private key into a CryptoKey.
      const privateKey = await window.crypto.subtle.importKey(
        'pkcs8',
        privateKeyBuffer,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        true,
        ['sign']
      );

      return privateKey;
    } catch (error) {
      console.error('Error importing private key from PEM:', error);
      return Promise.reject(error);
    }
  }

}
