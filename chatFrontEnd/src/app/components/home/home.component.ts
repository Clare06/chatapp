import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/endpoints/rest-endpoints';
import { ChatMessageDto } from 'src/app/schemas/chatMessageDto';
import { JwtService } from 'src/app/services/jwtservice.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
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

}
