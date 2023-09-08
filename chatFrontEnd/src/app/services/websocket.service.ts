import { Injectable } from '@angular/core';
import { ChatMessageDto } from '../schemas/chatMessageDto';
import { JwtService } from './jwtservice.service';
import { SharedchatService } from './sharedchat.service';
import { Status } from '../schemas/enum';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  index: number = 0;
  webSocket!: WebSocket;
  chatMessages: ChatMessageDto[] = [];
  // activeChat: ChatMessageDto[] = [];
  activeFrien: string = "";
  constructor(private jwtgetid:JwtService, private shared:SharedService,private jwtdeco:JwtService) {
     this.shared.triggerFunction$.subscribe((event) => {
      this.activeFrien=event.value;
     })
  }

  public openWebSocket(){

    const userId = this.jwtgetid.getID(); // Replace with the actual user ID
    this.webSocket = new WebSocket(`ws://localhost:8080/chat?${encodeURIComponent(userId)}`);

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
    console.log(this.chatMessages[this.index]);
  }
  public filterChatMessages(): ChatMessageDto[] {
    const filteredMessages: ChatMessageDto[] = this.chatMessages.filter((chatMessageDto) => {
      return (
        (chatMessageDto.user === this.jwtdeco.getID() && chatMessageDto.sendTo === this.activeFrien) ||
        (chatMessageDto.user === this.activeFrien && chatMessageDto.sendTo === this.jwtdeco.getID())
      );
    });

    return filteredMessages;
  }

  public closeWebSocket() {
    this.webSocket.close();
  }
}
