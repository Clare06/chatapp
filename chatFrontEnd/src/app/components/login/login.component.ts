import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/endpoints/rest-endpoints';
import { SignUser } from 'src/app/schemas/signUser';
import { Usercred } from 'src/app/schemas/usercred.interface';
import { confirmPasswordValidator } from 'src/app/validators/validator';
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
  message: string | null = null;
  signClicked: boolean = false;

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
      conpassword: ['',[Validators.required, confirmPasswordValidator('password')]],
      email:['',[Validators.required, Validators.email]]            // Add Validators.required
    });

  }

  onSignSubmit() {
    if (this.signForm.invalid) {
      return;  // Exit if the form is invalid
    }
    const user =this.signForm.value;
    const signUser = new SignUser(user.userid,user.username,user.password,user.email);

    this.signClicked=true;
    this.http.post(ENDPOINTS.SIGNUP, signUser,{responseType: 'text'}).subscribe(
      {
        next:(response) => {
          this.errorMes=null;
          this.message=response;
          this.signClicked=false;
        },
        error: (error)=>{
          this.message=null;
          this.signClicked=false;
          if(error.status===400){
          this.errorMes=error.error;

          }else{
            this.errorMes="Server Error";
          }
        }
      }
    )
    console.log(this.errorMes);
    console.log(this.message);
    }

  forgotPass() {
        this.router.navigate(['../forgotPassword']).then(()=>
        {
          window.location.reload();
        });
      }

  onSubmit(){

    if (this.loginForm.invalid) {
      console.log(this.loginForm.value.userid)
      console.log("invalid");
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
    this.loginForm.reset();
    this.signForm.reset();
  }
}
