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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  signForm !: FormGroup;
  token: any;
  errorMes: string | null = null;
  signup: boolean = false;
  message: string | null = null;
  signClicked: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private keyPair: KeypairService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userid: ['', Validators.required],
      passwordhash: ['', Validators.required]
    });
    this.signForm = this.fb.group({
      userid: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      conpassword: ['', [Validators.required, confirmPasswordValidator('password')]],
      email: ['', [Validators.required, Validators.email]]
    });
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

        const signUser = new SignUser(user.userid, user.username, user.password, user.email, pemPublicKey, encryptedPrivateKeyBase64);
        
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
            
            // NOTE: We absolutely DO NOT send the private key via email anymore. That is a critical security breach!
            // The private key is strictly locked in IndexedDB via PBKDF2 encryption.
            
            this.signClicked = false;
            this.signupTri();
            
            // Pre-fill login form for convenience
            this.loginForm.patchValue({ userid: user.userid, passwordhash: user.password });
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

  forgotPass() {
    this.router.navigate(['../forgotPassword']).then(() => {
      window.location.reload();
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const user = this.loginForm.value;
    
    // First, verify credentials with the backend
    this.http.post(ENDPOINTS.LOGIN, user, { responseType: 'text' }).toPromise().then(async (data) => {
        this.token = data;
        this.errorMes = null;
        
        try {
            // Fetch the encrypted key from local IndexedDB
            const dbuser = await db.getUserByName(user.userid);
            if (dbuser && dbuser.hiddenInfo && dbuser.hiddenInfo.encryptedPrivateKey) {
                // Unlock the keychain using the plaintext password they just typed!
                const privateKey = await this.keyPair.decryptPrivateKeyWithPassword(dbuser.hiddenInfo.encryptedPrivateKey, user.passwordhash);
                
                // Store the unlocked key in memory (RAM) for this session only
                this.keyPair.sessionPrivateKey = privateKey;
            } else {
                console.warn("Could not find an encrypted private key for this user locally.");
            }
        } catch (keyError) {
            console.error("Failed to unlock Private Key. Password might be wrong or key corrupted.", keyError);
            // Even if key decryption fails, we can still login, but messages won't decrypt
        }

        localStorage.setItem('token', this.token);
        this.router.navigate(['../home']);
      }
    ).catch((error) => {
        this.errorMes = "Login Failed";
    });
  }

  signupTri() {
    this.errorMes = null;
    this.signup = !this.signup;
    this.loginForm.reset();
    this.signForm.reset();
  }

  async convertPublicKeyToPEM(publicKey: CryptoKey): Promise<string> {
    const exportPromise = window.crypto.subtle.exportKey('spki', publicKey);
    const spki = await exportPromise;
    const publicKeyBuffer = new Uint8Array(spki);
    const base64PublicKey = btoa(String.fromCharCode(...publicKeyBuffer));
    return `-----BEGIN PUBLIC KEY-----\n${base64PublicKey}\n-----END PUBLIC KEY-----`;
  }
}
