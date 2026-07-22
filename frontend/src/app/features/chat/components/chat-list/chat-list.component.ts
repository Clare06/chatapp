import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FriendpopComponent } from 'src/app/features/chat/components/friendpop/friendpop.component';

import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/data/endpoints/rest-endpoints';
import { ChatMessageDto } from 'src/app/data/schemas/chatMessageDto';
import { Status } from 'src/app/data/schemas/enum';
import { JwtService } from 'src/app/core/services/jwtservice.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, FriendpopComponent],

  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit, OnDestroy {
  friendList: any[] = [];
  usrID: string | null = null;
  activeFrien: string = "";
  chat: ChatMessageDto[] = [];
  x !: number ;
  isPopupOpen = false;
  searchQuery: string = '';
  username: string = '';
  showLogoutConfirm: boolean = false;

  get filteredFriends(): any[] {
    if (!this.searchQuery) {
      return this.friendList;
    }
    return this.friendList.filter(f => f.username.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  constructor(public webSocketService: WebsocketService,
     private jwtdeco:JwtService,
     private http:HttpClient,
     private router:Router,
     private shared: SharedService) {
  }

  ngOnInit(): void {
    this.usrID = this.jwtdeco.getID();
    this.username = this.jwtdeco.getUserName();
    this.http.get<any[]>(ENDPOINTS.GETFRIENDDETAILS+this.usrID).subscribe(
      (data) => {
        this.friendList = data;
      }
    )
  }

  ngOnDestroy(): void {

  }

  onFriendRequest(eventData: any) {
    this.x = eventData;
  }
   public textTo (friend : any): void{
    console.log('ChatList: Clicking friend:', friend.userid);
    this.activeFrien = friend.userid;
    this.shared.triggerFunction(friend, this.chat);
   }
   logout() {
     this.logoutEvent.emit();
   }




  openPopup() {
    this.isPopupOpen = true;
    console.log(this.isPopupOpen);
  }

  closePopup() {
    this.ngOnInit();
    this.isPopupOpen = false;
  }

  isSettingsOpen = false;

  @Output() friendSelectedEvent = new EventEmitter<string>();
  @Output() logoutEvent = new EventEmitter<void>();
  @Output() openSettingsEvent = new EventEmitter<void>();
  @Output() openProfileEvent = new EventEmitter<void>();

  openSettings() {
    this.openSettingsEvent.emit();
  }

  openProfile() {
    this.openProfileEvent.emit();
  }
}
