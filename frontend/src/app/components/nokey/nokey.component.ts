import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtService } from '../../services/jwtservice.service';
import { KeypairService } from '../../services/keypair.service';
import { ENDPOINTS } from '../../endpoints/rest-endpoints';
import { db, User } from '../../indexdb/db';

@Component({
  selector: 'app-nokey',
  templateUrl: './nokey.component.html',
  styleUrls: ['./nokey.component.css']
})
export class NokeyComponent implements OnInit {
  unlockForm!: FormGroup;
  errorMes: string | null = null;
  isLoading: boolean = false;

  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private http: HttpClient,
    private jwtService: JwtService,
    private keypairService: KeypairService
  ){}

  ngOnInit(): void {
    this.unlockForm = this.fb.group({
      password: ['', Validators.required]
    });
  }

  async onUnlock() {
    if (this.unlockForm.invalid) return;

    this.isLoading = true;
    this.errorMes = null;
    const password = this.unlockForm.value.password;
    const userid = this.jwtService.getID();

    if (!userid) {
      this.errorMes = "Session expired. Please log in again.";
      this.isLoading = false;
      return;
    }

    try {
      // 1. Fetch the encrypted private key from the backend
      const response = await this.http.get(ENDPOINTS.GET_ENCRYPTED_KEY + userid, { responseType: 'text' }).toPromise();
      
      if (!response) {
        this.errorMes = "No encrypted key found on the server. Please sign up again.";
        this.isLoading = false;
        return;
      }

      // 2. Decrypt it using the password
      const privateKey = await this.keypairService.decryptPrivateKeyWithPassword(response, password);
      
      // 3. Save the encrypted blob to IndexedDB for offline access
      const dbuser: User = {
        user: userid,
        hiddenInfo: {
          encryptedPrivateKey: response,
        },
      };
      
      // Since it might already exist but be corrupted, we put/add it
      const userExists = await db.checkIfUserExists(userid);
      if(userExists){
          await db.users.put(dbuser);
      } else {
          await db.addUserWithPrivateKey(dbuser);
      }

      // 4. Save decrypted key to RAM and redirect
      this.keypairService.sessionPrivateKey = privateKey;
      this.router.navigate(['../home']);

    } catch (error) {
      console.error(error);
      this.errorMes = "Incorrect password or corrupted keychain. Could not unlock.";
    }
    
    this.isLoading = false;
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(["/login"])
  }
}
