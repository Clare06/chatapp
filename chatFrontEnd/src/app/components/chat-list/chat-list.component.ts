import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/endpoints/rest-endpoints';
import { ChatMessageDto } from 'src/app/schemas/chatMessageDto';
import { Status } from 'src/app/schemas/enum';
import { JwtService } from 'src/app/services/jwtservice.service';
import { SharedService } from 'src/app/services/shared.service';
import { SharedchatService } from 'src/app/services/sharedchat.service';
import { WebsocketService } from 'src/app/services/websocket.service';

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
  x: number = 0;
  isPopupOpen = false;
  searchQuery: string = '';

  constructor(public webSocketService: WebsocketService,
     private jwtdeco:JwtService, 
     private http:HttpClient, 
     private router:Router,
     private shared: SharedService,
     private chatshared:SharedchatService) {
  }

  ngOnInit(): void {
    this.usrID = this.jwtdeco.getID();
    console.log(this.usrID);
    this.http.get<string[]>(ENDPOINTS.GETFRIEND+this.usrID).subscribe(
      (data) => {
        this.friendList = data;
      }
    )
    console.log(this.friendList[0]);
   
  }

  ngOnDestroy(): void {
   
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
    this.isPopupOpen = false;
  }

  
}
