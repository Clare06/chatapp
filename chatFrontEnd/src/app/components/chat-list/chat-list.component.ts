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
  // tempChat:ChatMessageDto[]=[];
  chat: ChatMessageDto[] = [];
  // active: boolean = false;
  x: number = 0;
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
    // this.webSocketService.openWebSocket();
  }

  ngOnDestroy(): void {
    // this.webSocketService.closeWebSocket();
  }

  // callFunctionActive(){
  //   this.webSocketService.chatMessages.forEach((chatMessageDto, index) => {
  //     // console.log(chatMessageDto.status+"   status");
  //     // console.log("condition" + ((chatMessageDto.user===this.jwtdeco.getID() && chatMessageDto.sendTo===this.activeFrien) || (chatMessageDto.user===this.activeFrien && chatMessageDto.sendTo===this.jwtdeco.getID())) && chatMessageDto.status)
  //     // console.log(this.chat.length);

  //     if ((chatMessageDto.user===this.jwtdeco.getID() && chatMessageDto.sendTo===this.activeFrien) || (chatMessageDto.user===this.activeFrien && chatMessageDto.sendTo===this.jwtdeco.getID())){
  //       chatMessageDto.status=false;
  //       // console.log(chatMessageDto.status + " " + index);
  //       this.chat.push(chatMessageDto);
  //       this.chatshared.activeFunction(index);
  //     }
  //   });
  // }
   public textTo (userId : string): void{
    this.activeFrien = userId;
    this.shared.triggerFunction(userId,this.chat);
    // this.callFunctionActive();
   
    // for(this.x=0;this.x<this.chat.length;this.x++){
    //   console.log(this.chat[this.x]);
    // }
    
   }
   logout(){
    localStorage.removeItem('token');
    this.router.navigate(["/login"]).then(()=>{
      window.location.reload();
    })
  }
  // callService(userId : string){

  // }
}
