import { Injectable, OnInit } from '@angular/core';
import { ChatMessageDto } from '../schemas/chatMessageDto';
import { JwtService } from './jwtservice.service';
import { SharedchatService } from './sharedchat.service';
import { Status } from '../schemas/enum';
import { SharedService } from './shared.service';
import { KeypairService } from './keypair.service';
import { db } from '../indexdb/db';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from '../endpoints/rest-endpoints';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnInit {
  index: number = 0;
  pubKey: string = "";
  webSocket!: WebSocket;
  userID!:string;
  chatMessages: ChatMessageDto[] = [];
  activeFrien: string = "";

  constructor(private router:Router ,private http:HttpClient,private jwtgetid:JwtService, private shared:SharedService,private jwtdeco:JwtService, private key:KeypairService) {
     this.shared.triggerFunction$.subscribe((event) => {
      this.activeFrien=event.value;
     })
     this.userID=jwtdeco.getID();
     this.pubKey=this.jwtdeco.getPubKey();

    this.http.get<ChatMessageDto[]>(ENDPOINTS.GETMESSAGE + this.jwtdeco.getID()).subscribe(async (data) => {
      const serverData = data;
      this.chatMessages = await Promise.all(serverData.map(async (item) => {
        try {
          const privateKey = this.key.sessionPrivateKey;
          if (privateKey) {
            if (item.user === this.jwtdeco.getID()) {
              item.senderMessage = await this.decryptMessage(item.senderMessage, privateKey);
            } else {
              item.message = await this.decryptMessage(item.message, privateKey);
            }
          } else {
            console.error('Private key not unlocked in memory!');
          }
        } catch (error) {
          console.error('Error decrypting message on load:', error);
        }
        return new ChatMessageDto(
          item.user,
          item.senderMessage,
          item.message,
          item.sendTo,
          item.status,
          item.timestamp
        );
      }));
    });
  }

  ngOnInit(): void {
  }

  public openWebSocket(){
    const userId = this.jwtgetid.getID(); 
    this.webSocket = new WebSocket(`ws://localhost:8080/chat?${encodeURIComponent(userId)}`);

    this.webSocket.onopen = async (event) => {
      console.log('Open: ', event);
      if(!this.key.sessionPrivateKey){
          // If they refresh the page, their JWT logs them in but they lost the RAM key.
          this.router.navigate(['../nokey']).then(() => {});
      }
    };

    this.webSocket.onmessage = async (event) => {
      const chatMessageDto = JSON.parse(event.data);
      const privateKey = this.key.sessionPrivateKey;

      if (privateKey) {
        try {
          chatMessageDto.message = await this.decryptMessage(chatMessageDto.message, privateKey);
          this.chatMessages.push(chatMessageDto);
        } catch (error) {
          console.error('Error decrypting incoming message:', error);
        }
      } else {
        console.error('Cannot decrypt incoming message: Private key missing in memory.');
      }
    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };
  }

  public async sendMessage(chatMessageDto: ChatMessageDto) {
    this.webSocket.send(JSON.stringify(chatMessageDto));
    
    const privateKey = this.key.sessionPrivateKey;
    if (privateKey) {
        try {
          chatMessageDto.senderMessage = await this.decryptMessage(chatMessageDto.senderMessage, privateKey);
          this.chatMessages.push(chatMessageDto);
        } catch (error) {
          console.error('Error decrypting own outgoing message:', error);
        }
    } else {
        console.error('Cannot decrypt own message: Private key missing in memory.');
    }
  }

  public filterChatMessages(): ChatMessageDto[] {
    return this.chatMessages.filter((chatMessageDto) => {
      return (
        (chatMessageDto.user === this.jwtdeco.getID() && chatMessageDto.sendTo === this.activeFrien) ||
        (chatMessageDto.user === this.activeFrien && chatMessageDto.sendTo === this.jwtdeco.getID())
      );
    });
  }

  public closeWebSocket() {
    this.webSocket.close();
  }

  async decryptMessage(encryptedMessageBase64: string, privateKey: CryptoKey): Promise<string> {
    try {
      const encryptedMessageBuffer = new Uint8Array(
        atob(encryptedMessageBase64)
          .split('')
          .map((char) => char.charCodeAt(0))
      );

      const decryptedMessageBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP',
        },
        privateKey,
        encryptedMessageBuffer
      );

      return new TextDecoder().decode(decryptedMessageBuffer);
    } catch (error) {
      console.error('Error decrypting the message:', error);
      throw error;
    }
  }
}
