import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
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
