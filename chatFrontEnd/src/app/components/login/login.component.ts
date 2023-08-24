import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/endpoints/rest-endpoints';
import { Usercred } from 'src/app/schemas/usercred.interface';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  token: any;
  errorMes: string | null= null
  constructor (private fb:FormBuilder, private http:HttpClient, private router:Router){

  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userid: ['', Validators.required],            // Add Validators.required
      passwordhash: ['', Validators.required]
    });
  }
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
}
