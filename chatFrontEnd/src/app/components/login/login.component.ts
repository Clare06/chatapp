import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/endpoints/rest-endpoints';
import { User, db } from 'src/app/indexdb/db';
import { EmailPriv } from 'src/app/schemas/emailPriv';
import { SignUser } from 'src/app/schemas/signUser';
import { Usercred } from 'src/app/schemas/usercred.interface';
import { EmailService } from 'src/app/services/email.service';
import { KeypairService } from 'src/app/services/keypair.service';
import { confirmPasswordValidator } from 'src/app/validators/validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  loginForm!: FormGroup;
  signForm !: FormGroup;
  token: any;
  errorMes: string | null= null;
  signup: boolean = false;
  message: string | null = null;
  signClicked: boolean = false;

  constructor(private email:EmailService,private fb: FormBuilder, private http: HttpClient, private router: Router, private keyPair: KeypairService) { }

  async convertPrivateKeyToPEM(privateKey: CryptoKey): Promise<string> {
    const exportPromise = window.crypto.subtle.exportKey('pkcs8', privateKey);
    const pkcs8 = await exportPromise;
    const privateKeyBuffer = new Uint8Array(pkcs8);
    const base64PrivateKey = btoa(String.fromCharCode(...privateKeyBuffer));
    return `${base64PrivateKey}`;
  }

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
    this.keyPair.generateKeyPair().then(async (keyPair) => {
      const publicKey = keyPair.publicKey;
      const privateKey = keyPair.privateKey;

      const pemPrivateKey = await this.convertPrivateKeyToPEM(privateKey);
      const pemPublicKey = await this.convertPublicKeyToPEM(publicKey);

      const signUser = new SignUser(user.userid, user.username, user.password, user.email, pemPublicKey);
      this.http.post(ENDPOINTS.SIGNUP, signUser, { responseType: 'text' }).subscribe(
        {
          next: async (response) => {
            this.errorMes = null;
            this.message = response;

            const privateKeyBase64 = await this.keyPair.exportPrivateKeyAsBase64(privateKey);
            const dbuser: User = {
              user: signUser.userid,
              hiddenInfo: {
                encryptedPrivateKey: privateKeyBase64,
              },
            }
            await db.addUserWithPrivateKey(dbuser);
            const emailPri=new EmailPriv(signUser.email,pemPrivateKey,signUser.userid);
            console.log(emailPri);
            this.http.post(ENDPOINTS.SENDEMAIL,emailPri).subscribe(data=>{});
            // this.email.sendEmail(signUser.email,pemPrivateKey).subscribe(data=>{});
            this.signClicked = false;
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
        }
      )
    });
  }

  forgotPass() {
    this.router.navigate(['../forgotPassword']).then(() => {
      window.location.reload();
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const user = this.loginForm.value;
    this.http.post(ENDPOINTS.LOGIN, user, { responseType: 'text' }).toPromise().then(
      (data) => {
        this.token = data;
        this.errorMes = null;
        localStorage.setItem('token', this.token);
        this.router.navigate(['../home']).then(() => {
          window.location.reload();
        });
      }
    ).catch(
      (error) => {
        this.errorMes = "Login Failed";
      }
    );
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
