import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/endpoints/rest-endpoints';
import { ChatMessageDto } from 'src/app/schemas/chatMessageDto';
import { Status } from 'src/app/schemas/enum';
import { JwtService } from 'src/app/services/jwtservice.service';
import { SharedService } from 'src/app/services/shared.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ChatMessageContainerComponent } from '../chat-message-container/chat-message-container.component';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit, OnDestroy {
  friendList: string[] = [];
  usrID: string | null = null;
  activeFrien: string = "";
  chat: ChatMessageDto[] = [];
  x !: number ;
  isPopupOpen = false;
  searchQuery: string = '';
  username: string = '';

  get filteredFriends(): string[] {
    if (!this.searchQuery) {
      return this.friendList;
    }
    return this.friendList.filter(f => f.toLowerCase().includes(this.searchQuery.toLowerCase()));
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
    this.http.get<string[]>(ENDPOINTS.GETFRIEND+this.usrID).subscribe(
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
   public textTo (userId : string): void{
    this.activeFrien = userId;
    this.shared.triggerFunction(userId,this.chat);

   }
   logout(){
    localStorage.removeItem('token');
    this.router.navigate(["/login"]).then(()=>{
      window.location.reload();
    })
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
  @Output() openSettingsEvent = new EventEmitter<void>();
  @Output() openProfileEvent = new EventEmitter<void>();

  openSettings() {
    this.openSettingsEvent.emit();
  }

  openProfile() {
    this.openProfileEvent.emit();
  }
}
