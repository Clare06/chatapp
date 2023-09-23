import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/endpoints/rest-endpoints';
import { ForgotPassReq } from 'src/app/schemas/forgotPassReq';
import { NewPass } from 'src/app/schemas/newPass';
import { Otp } from 'src/app/schemas/otp';
import { confirmPasswordValidator } from 'src/app/validators/validator';
declare var PupilMovement:any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ForgotPasswordComponent {


  sendOtp: boolean = false;
  setNewPass: boolean = false;
  otpResponse: string | null = null;
  responseText: string | null = null;
  newPassResponse: string | null = null;
  forgotPassForm: FormGroup;
  otpForm: FormGroup;
  newPassForm: FormGroup;
  email: string = '';
  otp:string='';
  emailSub: boolean = false;
  otpSub: boolean = false;
  time: number = 300;

  constructor(private fb: FormBuilder, private http:HttpClient, private router: Router) {
    this.forgotPassForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.otpForm= this.fb.group({
      otp: ['', [Validators.required]]
    });
    this.newPassForm= this.fb.group({
      newPass: ['', [Validators.required]],
      confPass: ['', [Validators.required, confirmPasswordValidator('newPass')]]
    });
  }


    ngOnInit() {
      PupilMovement.init();
    }

    onSubmit() {
      if (this.forgotPassForm.invalid) {
        return;
      }
      const forgotPassReq = this.forgotPassForm.value;
      const forgEmail=new ForgotPassReq(forgotPassReq.email);
      this.responseText=null;
      this.emailSub=true;
      this.http.post(ENDPOINTS.FORGOTPASS,forgEmail,{responseType: 'text'}).subscribe(
        {
        next: (res:any)=>{

            this.sendOtp=true;
            this.email=forgEmail.email;
            console.log(this.sendOtp);
            this.timer();

        },
        error: (err:any)=>{
          this.sendOtp=false;
          this.emailSub=false;
          if(err.status===404){
            this.responseText=err.error;

          }
          else{
          this.responseText=err.error;
          }
        }

      })

    }
    onSubmitOtp() {
      if (this.otpForm.invalid) {
        return;
      }
      const otpInput= this.otpForm.value;
      const otp= new Otp(otpInput.otp,this.email)
      this.otpSub=true;
      this.http.post(ENDPOINTS.OTP,otp,{responseType: 'text'}).subscribe({
        next: (res:any)=>{

            this.setNewPass=true;
            this.otp=otp.otp;

        },
        error: (err: any)=>{

            if(err.status===400){
              this.otpResponse=err.error;
              this.otpSub=false;
              console.log(this.otpResponse);
            }else{

            this.otpResponse=err.error;
            this.navigateToForgotPassword();
            }
        }
      })
      }
      onSubmitPass() {
        if (this.newPassForm.invalid) {
          return;
        }
        const newPassInput= this.newPassForm.value;
        const newPass= new NewPass(newPassInput.newPass,newPassInput.confPass,this.email,this.otp)
        this.http.post(ENDPOINTS.NEWPASS,newPass,{responseType: 'text'}).subscribe({
          next: (res:any)=>{

            this.router.navigate(['../login']).then(()=>
            {
              window.location.reload();
            });
          },
          error: (err: any)=>{

            this.navigateToForgotPassword();
          }
        })
      }
      onBack() {
        if(!this.sendOtp){

          this.router.navigate(['../login']).then(()=>
        {
          window.location.reload();
        });
        }else if(this.sendOtp){

        this.navigateToForgotPassword();
      }

      }

      timer(): void{

        setInterval(() => {
          if (this.time > 0) {
            this.time--;
          }
          if(this.time===0){
            this.navigateToForgotPassword();
          }
        }, 1000);

      }
      secondsToMinutes(seconds: number): number {
        return Math.floor(seconds / 60);
      }
      remainingSeconds(seconds: number): number {
        return seconds % 60;
      }
      navigateToForgotPassword(): void {
        this.router.navigate(['../forgotPassword']).then(()=>
        {
          window.location.reload();
        });
      }
}
