import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/data/endpoints/rest-endpoints';
import { db } from 'src/app/data/indexdb/db';
import { KeypairService } from 'src/app/core/services/keypair.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],

  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  token: any;
  errorMes: string | null = null;
  message: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private keyPair: KeypairService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      passwordhash: ['', Validators.required]
    });
  }

  forgotPass() {
    this.router.navigate(['/forgotPassword']);
  }

  gotoSignup() {
    this.router.navigate(['/signup']);
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
            // Decode the JWT to get the actual userid
            const payloadStr = atob(this.token.split('.')[1]);
            const decodedToken = JSON.parse(payloadStr);
            const actualUserId = decodedToken.userid;

            // Fetch the encrypted key from local IndexedDB
            const dbuser = await db.getUserByName(actualUserId);
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
        this.router.navigate(['/home']);
      }
    ).catch((error) => {
        this.errorMes = "Login Failed";
    });
  }
}
