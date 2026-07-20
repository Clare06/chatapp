import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpInterceptorRecieverService } from './services/http-interceptor-reciever.service';
import { HttpInterceptorService } from './services/http-interceptor.service';

import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { KeystoreComponent } from './components/keystore/keystore.component';
import { NokeyComponent } from './components/nokey/nokey.component';
import { SignupComponent } from './components/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    KeystoreComponent,
    NokeyComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSlideToggleModule
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi   : true,
    },
    {
      provide : HTTP_INTERCEPTORS,
      useClass: HttpInterceptorRecieverService,
      multi   : true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
