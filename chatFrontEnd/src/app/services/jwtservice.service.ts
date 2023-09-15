import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class JwtService {
  userID!: string;
  userName!: string;
  verify: boolean=false;
  private jwtHelper: JwtHelperService = new JwtHelperService();


  public getID () : string {
    const token = localStorage.getItem('token');

    if(token){
      this.userID = this.jwtHelper.decodeToken(token).userid;
      return this.userID;
    }

    return  "";

  }
  public getUserName () : string {
    const token = localStorage.getItem('token');

    if(token){
      this.userName = this.jwtHelper.decodeToken(token).username;
      return this.userName;
    }

    return  "";

  }
  public getVerify () : boolean {
    const token = localStorage.getItem('token');

    if(token){
      this.verify = this.jwtHelper.decodeToken(token).verify;
      return this.verify;
    }

    return  this.verify;

  }

}
