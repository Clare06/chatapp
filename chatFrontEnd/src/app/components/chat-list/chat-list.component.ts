import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/endpoints/rest-endpoints';
import { ChatMessageDto } from 'src/app/schemas/chatMessageDto';
import { JwtService } from 'src/app/services/jwtservice.service';
import { SharedService } from 'src/app/services/shared.service';
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
  // active: boolean = false;
  constructor(public webSocketService: WebsocketService,
     private jwtdeco:JwtService, 
     private http:HttpClient, 
     private router:Router,
     private shared: SharedService) {
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

  
   public textTo (userId : string): void{
    this.activeFrien = userId;
    // console.log(this.activeFrien);
    this.shared.triggerFunction(userId);
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
