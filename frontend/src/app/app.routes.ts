import { Routes } from '@angular/router';
import { LoginComponent } from 'src/app/features/auth/components/login/login.component';
import { SignupComponent } from 'src/app/features/auth/components/signup/signup.component';
import { AuthGuard } from 'src/app/core/guards/authguard.service';
import { ForgotPasswordComponent } from 'src/app/features/auth/components/forgot-password/forgot-password.component';
import { KeystoreComponent } from 'src/app/features/auth/components/keystore/keystore.component';
import { NokeyComponent } from 'src/app/features/auth/components/nokey/nokey.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { 
    path: 'home', 
    loadComponent: () => import('src/app/features/chat/components/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard],
    children: [
      { 
        path: 'chat/:id', 
        loadComponent: () => import('src/app/features/chat/components/chat-message-container/chat-message-container.component').then(m => m.ChatMessageContainerComponent) 
      }
    ]
  },
  { path: 'sendemail/accesskey', component: KeystoreComponent },
  { path: 'nokey', component: NokeyComponent, canActivate: [AuthGuard] }
];
