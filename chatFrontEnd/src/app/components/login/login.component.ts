import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
  constructor (private fb:FormBuilder, private http:HttpClient){

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

        }
      ).catch(
        (error) => {

        }
      );

      console.log(this.token);
  }
}
