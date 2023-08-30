import { Injectable } from '@angular/core';
import { ChatMessageDto } from '../schemas/chatMessageDto';
import { JwtService } from './jwtservice.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  webSocket!: WebSocket;
  chatMessages: ChatMessageDto[] = [];

  constructor(private jwtgetid:JwtService) { }

  public openWebSocket(){

    const userId = this.jwtgetid.getID(); // Replace with the actual user ID
    this.webSocket = new WebSocket(`ws://10.10.21.162:8080/chat?${encodeURIComponent(userId)}`);

    this.webSocket.onopen = (event) => {
      console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event) => {
      const chatMessageDto = JSON.parse(event.data);
      console.log('Message: ', chatMessageDto);
      this.chatMessages.push(chatMessageDto);
    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };
  }

  public sendMessage(chatMessageDto: ChatMessageDto){
    this.webSocket.send(JSON.stringify(chatMessageDto));
    console.log('Message sent: ', JSON.stringify(chatMessageDto));
    this.chatMessages.push(chatMessageDto);
  }

  public closeWebSocket() {
    this.webSocket.close();
  }
}
