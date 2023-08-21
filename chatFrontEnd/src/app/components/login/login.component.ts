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
  myForm: FormGroup;
  token: any;
  constructor (private fb:FormBuilder, private http:HttpClient){
    this.myForm=fb.group({
      'email':['',Validators.required],
      'password':['',Validators.required]
    });
  }

  onSubmit(user: Usercred){
      this.http.post<Usercred>(ENDPOINTS.LOGIN, user).toPromise().then(
        (data) => {
          
        }
      ).catch(
        (error) => {

        }
      );
  }
}
