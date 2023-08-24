import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  jwt_decode(token: string){

    const decodedToken = jwt_decode(token);
    return decodedToken;
  }

}
