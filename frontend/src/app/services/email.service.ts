import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailPriv } from '../schemas/emailPriv';
import { ENDPOINTS } from '../endpoints/rest-endpoints';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http:HttpClient) {



    }
    // public  sendEmail(email:string,privateKey:string){
    //   const emailP= new EmailPriv(email,privateKey);
    //  console.log(this.http.post<any>(ENDPOINTS.SENDEMAIL, emailP));
    //   return this.http.post<any>(ENDPOINTS.SENDEMAIL,emailP);
    // }
  }

