import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/endpoints/rest-endpoints';
import { Usercred } from 'src/app/schemas/usercred.interface';
// declare var myExtObject: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
  // encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

  loginForm!: FormGroup;
  signForm !: FormGroup;
  token: any;
  errorMes: string | null= null;
  signup: boolean = false;
  constructor (private fb:FormBuilder, private http:HttpClient, private router:Router){

  }

  ngOnInit(): void {
    // customJs.createBubbles();
    // createBubbles();
    // myExtObject.createBubbles();
    this.loginForm = this.fb.group({
      userid: ['', Validators.required],            // Add Validators.required
      passwordhash: ['', Validators.required]
    });
    this.signForm = this.fb.group({
      userid: ['', Validators.required],
      username: ['',Validators.required],
      password: ['',Validators.required],
      conpassword: ['',Validators.required,this.matchPasswords.bind(this)]            // Add Validators.required
    });

  }
  onSignSubmit() {
    if (this.signForm.invalid) {
      return;  // Exit if the form is invalid
    }
    const user =this.signForm.value;
    }
  matchPasswords(control: FormGroup) {
    const password = control.get('password')?.value;
    const conpassword = control.get('conpassword')?.value;

    // Check if the passwords match
    if (password === conpassword) {
      return null; // Valid, passwords match
    } else {
      return { mismatch: true }; // Invalid, passwords don't match
    }}

  onSubmit(){

    if (this.loginForm.invalid) {
      return;  // Exit if the form is invalid
    }

    const user =this.loginForm.value;
    console.log(user.passwordhash + user.userid)
      this.http.post(ENDPOINTS.LOGIN, user,{responseType: 'text'}).toPromise().then(
        (data) => {
          this.token = data;
          this.errorMes= null;
          localStorage.setItem('token', this.token);
          this.router.navigate(['../home']).then(()=>
                {
                  window.location.reload();
                });
        }
      ).catch(
        (error) => {
            this.errorMes = "Login Failed";
        }
      );

      console.log(this.token);
  }
  signupTri(){
    this.errorMes= null;
    this.signup = !this.signup;
  }
}
