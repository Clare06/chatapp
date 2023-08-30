import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatMessageDto } from 'src/app/schemas/chatMessageDto';
import { JwtService } from 'src/app/services/jwtservice.service';
import { SharedService } from 'src/app/services/shared.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-chat-message-container',
  templateUrl: './chat-message-container.component.html',
  styleUrls: ['./chat-message-container.component.css']
})
export class ChatMessageContainerComponent {
  activeFrien: string = "";

  constructor(public webSocketService: WebsocketService, private jwtdeco:JwtService,
     private http:HttpClient, private router:Router,
     private shared:SharedService) {
      this.shared.triggerFunction$.subscribe((value) => {
        this.activeFrien=value;
      })
  }
  
  sendMessage(sendForm: NgForm) {
    const chatMessageDto = new ChatMessageDto(this.jwtdeco.getID(), sendForm.value.message, this.activeFrien);
    this.webSocketService.sendMessage(chatMessageDto);
    sendForm.controls['message'].reset();
  }

}
