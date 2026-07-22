import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/data/endpoints/rest-endpoints';
import { User, db } from 'src/app/data/indexdb/db';
import { SignUser } from 'src/app/data/schemas/signUser';
import { KeypairService } from 'src/app/core/services/keypair.service';
import { confirmPasswordValidator } from 'src/app/shared/validators/validator';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],

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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
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
    
    const generatedUserId = crypto.randomUUID().substring(0, 8);
    const generatedUsername = `${user.firstName} ${user.lastName}`.trim();
    
    try {
        const keyPair = await this.keyPair.generateKeyPair();
        const publicKey = keyPair.publicKey;
        const privateKey = keyPair.privateKey;

        const pemPublicKey = await this.convertPublicKeyToPEM(publicKey);

        // Zero-Knowledge Architecture: Encrypt the private key with the user's plaintext password
        const encryptedPrivateKeyBase64 = await this.keyPair.encryptPrivateKeyWithPassword(privateKey, user.password);

        const signUser = new SignUser(
          generatedUserId, 
          generatedUsername, 
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
            if (error.status === 400 || error.status === 409) {
              this.errorMes = typeof error.error === 'string' ? error.error : error.error?.message || "An error occurred";
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
