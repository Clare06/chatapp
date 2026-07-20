import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/endpoints/rest-endpoints';
import { User, db } from 'src/app/indexdb/db';
import { SignUser } from 'src/app/schemas/signUser';
import { KeypairService } from 'src/app/services/keypair.service';
import { confirmPasswordValidator } from 'src/app/validators/validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signForm !: FormGroup;
  errorMes: string | null = null;
  message: string | null = null;
  signClicked: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private keyPair: KeypairService) { }

  ngOnInit(): void {
    this.signForm = this.fb.group({
      userid: ['', Validators.required],
      username: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      conpassword: ['', [Validators.required, confirmPasswordValidator('password')]]
    });
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }

  async onSignSubmit() {
    if (this.signForm.invalid) {
      return;
    }
    const user = this.signForm.value;
    this.signClicked = true;
    
    try {
        const keyPair = await this.keyPair.generateKeyPair();
        const publicKey = keyPair.publicKey;
        const privateKey = keyPair.privateKey;

        const pemPublicKey = await this.convertPublicKeyToPEM(publicKey);

        // Zero-Knowledge Architecture: Encrypt the private key with the user's plaintext password
        const encryptedPrivateKeyBase64 = await this.keyPair.encryptPrivateKeyWithPassword(privateKey, user.password);

        const signUser = new SignUser(
          user.userid, 
          user.username, 
          user.password, 
          user.email, 
          pemPublicKey, 
          encryptedPrivateKeyBase64,
          user.firstName,
          user.lastName
        );
        
        this.http.post(ENDPOINTS.SIGNUP, signUser, { responseType: 'text' }).subscribe({
          next: async (response) => {
            this.errorMes = null;
            this.message = response;
            
            const dbuser: User = {
              user: signUser.userid,
              hiddenInfo: {
                encryptedPrivateKey: encryptedPrivateKeyBase64,
              },
            }
            await db.addUserWithPrivateKey(dbuser);
            
            this.signClicked = false;
            // Go back to login on success
            this.router.navigate(['/login']);
          },
          error: (error) => {
            this.message = null;
            this.signClicked = false;
            if (error.status === 400) {
              this.errorMes = error.error;
            } else {
              this.errorMes = "Server Error";
            }
          }
        });
    } catch(err) {
        console.error(err);
        this.errorMes = "Failed to generate security keys.";
        this.signClicked = false;
    }
  }

  async convertPublicKeyToPEM(publicKey: CryptoKey): Promise<string> {
    const exportPromise = window.crypto.subtle.exportKey('spki', publicKey);
    const spki = await exportPromise;
    const publicKeyBuffer = new Uint8Array(spki);
    const base64PublicKey = btoa(String.fromCharCode(...publicKeyBuffer));
    return `-----BEGIN PUBLIC KEY-----\n${base64PublicKey}\n-----END PUBLIC KEY-----`;
  }
}
