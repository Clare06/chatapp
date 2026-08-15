import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChangePasswordComponent } from 'src/app/features/auth/components/change-password/change-password.component';
import { ChatListComponent } from 'src/app/features/chat/components/chat-list/chat-list.component';
import { ChatMessageContainerComponent } from 'src/app/features/chat/components/chat-message-container/chat-message-container.component';
import { UserProfileComponent } from 'src/app/features/chat/components/user-profile/user-profile.component';
import { VerifyEmailPopComponent } from 'src/app/shared/components/verify-email-pop/verify-email-pop.component';

import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/data/endpoints/rest-endpoints';
import { ChatMessageDto } from 'src/app/data/schemas/chatMessageDto';
import { JwtService } from 'src/app/core/services/jwtservice.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ChangePasswordComponent, ChatListComponent, ChatMessageContainerComponent, UserProfileComponent, VerifyEmailPopComponent],

  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {
  friendList: string[] = [];
  usrID: string | null = null;
  activeFrien: string = "";
  verify!: boolean;
  friendKeys: any;
  constructor(public webSocketService: WebsocketService, private jwtdeco:JwtService, private http:HttpClient, private router:Router) {
  }

  ngOnInit(): void {
    this.usrID = this.jwtdeco.getID();
    this.verify = this.jwtdeco.getVerify();
    this.http.get<string[]>(ENDPOINTS.GETFRIEND+this.usrID).subscribe(
      (data) => {
        this.friendList = data;
      }
    )


    this.webSocketService.openWebSocket();
  }

  ngOnDestroy(): void {
    this.webSocketService.closeWebSocket();
  }


   public textTo (userId : string): void{
    this.activeFrien = userId;
    console.log(this.activeFrien);
   }

  isSettingsOpen = false;
  isProfileOpen = false;

  openSettings() {
    this.isSettingsOpen = true;
  }

  closeSettings() {
    this.isSettingsOpen = false;
  }
  
  openProfile() {
    this.isProfileOpen = true;
  }
  
  closeProfile() {
    this.isProfileOpen = false;
  }

  showLogoutConfirm = false;

  openLogoutConfirm() {
    this.showLogoutConfirm = true;
  }

  confirmLogout() {
    localStorage.removeItem('token');
    this.router.navigate(["/login"]).then(()=>{
      window.location.reload();
    })
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }
}
