import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { JwtService } from '../services/jwtservice.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private jwtService: JwtService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = this.jwtService.getToken();
    if (token) {
      token = token.replace(/^"(.*)"$/, '$1');
      request = request.clone({
        setHeaders: {
          'Content-Type' : 'application/json; charset=utf-8',
           'Accept'       : 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }

}
