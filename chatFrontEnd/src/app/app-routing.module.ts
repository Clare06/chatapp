import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './services/authguard.service';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { KeystoreComponent } from './components/keystore/keystore.component';
import { NokeyComponent } from './components/nokey/nokey.component';

const routes: Routes = [
  {path:"login",component:LoginComponent},
  {path:"",component:LoginComponent},
  {path:"forgotPassword",component:ForgotPasswordComponent},
  {path:"home",component:HomeComponent, canActivate: [AuthGuard]},
  {path:"sendemail/accesskey",component:KeystoreComponent},
  {path:"nokey",component:NokeyComponent, canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
