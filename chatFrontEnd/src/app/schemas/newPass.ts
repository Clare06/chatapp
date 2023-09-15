export class NewPass{
  newPass: string;
     confPass: string;
     email: string;
     otp: string;
     constructor(newPass:string,confPass:string,email:string,otp:string){
       this.newPass=newPass;
       this.confPass=confPass;
       this.email=email;
        this.otp=otp;
     }
}
