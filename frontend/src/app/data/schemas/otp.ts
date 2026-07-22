export class Otp{
  email:string;
  otp: string;
  constructor(otp:string, email:string){
    this.otp=otp;
    this.email=email;
  }
}
