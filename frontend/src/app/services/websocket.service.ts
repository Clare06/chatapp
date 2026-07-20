import { Injectable, OnInit, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatMessageDto } from '../schemas/chatMessageDto';
import { JwtService } from './jwtservice.service';
import { Status } from '../schemas/enum';
import { SharedService } from './shared.service';
import { KeypairService } from './keypair.service';
import { db } from '../indexdb/db';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from '../endpoints/rest-endpoints';
import { environment } from '../../environments/environment';
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
  isTyping$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  typingTimeout: any;

  private reconnectInterval = 1000;
  private maxReconnectInterval = 30000;
  private isIntentionalClose = false;

  onlineFriends: Set<string> = new Set<string>();
  onlineFriends$: BehaviorSubject<Set<string>> = new BehaviorSubject<Set<string>>(new Set());

  unreadCounts: Map<string, number> = new Map<string, number>();
  unreadCounts$: BehaviorSubject<Map<string, number>> = new BehaviorSubject<Map<string, number>>(new Map());

  constructor(private router:Router ,private http:HttpClient,private jwtgetid:JwtService, private shared:SharedService,private jwtdeco:JwtService, private key:KeypairService, private ngZone: NgZone) {
     this.shared.triggerFunction$.subscribe((event) => {
      this.activeFrien=event.value;
      const currentUnread = new Map(this.unreadCounts);
      if (currentUnread.has(this.activeFrien)) {
          currentUnread.delete(this.activeFrien);
          this.unreadCounts = currentUnread;
          this.unreadCounts$.next(this.unreadCounts);
      }
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
          item.timestamp,
          'MESSAGE',
          item.read,
          item.id,
          item.deleted
        );
      }));
    });
  }

  ngOnInit(): void {
  }

  public openWebSocket(){
    this.isIntentionalClose = false;
    const token = localStorage.getItem('token') || ''; 
    const wsUrl = environment.apiUrl.replace('http', 'ws') + '/chat';
    this.webSocket = new WebSocket(`${wsUrl}?token=${encodeURIComponent(token)}`);

    this.webSocket.onopen = async (event) => {
      console.log('Open: ', event);
      this.reconnectInterval = 1000;
      if(!this.key.sessionPrivateKey){
          // If they refresh the page, their JWT logs them in but they lost the RAM key.
          this.router.navigate(['../nokey']).then(() => {});
      }
    };

    this.webSocket.onmessage = async (event) => {
      this.ngZone.run(async () => {
        const chatMessageDto = JSON.parse(event.data);
        if (chatMessageDto.type === 'TYPING') {
        if (chatMessageDto.user === this.activeFrien) {
          this.isTyping$.next(true);
          clearTimeout(this.typingTimeout);
          this.typingTimeout = setTimeout(() => this.isTyping$.next(false), 2000);
        }
        return;
      }

      if (chatMessageDto.type === 'PRESENCE') {
        const currentOnline = new Set(this.onlineFriends);
        if (chatMessageDto.status === 'ONLINE') {
            currentOnline.add(chatMessageDto.user);
        } else {
            currentOnline.delete(chatMessageDto.user);
        }
        this.onlineFriends = currentOnline;
        this.onlineFriends$.next(this.onlineFriends);
        return;
      }

      if (chatMessageDto.type === 'PRESENCE_LIST') {
        const currentOnline = new Set<string>(chatMessageDto.onlineUsers);
        this.onlineFriends = currentOnline;
        this.onlineFriends$.next(this.onlineFriends);
        return;
      }

      if (chatMessageDto.type === 'READ') {
        this.chatMessages.forEach(msg => {
          if (msg.sendTo === chatMessageDto.user && msg.user === this.jwtdeco.getID()) {
            msg.read = true;
          }
        });
        return;
      }

      if (chatMessageDto.type === 'DELETE') {
         const msg = this.chatMessages.find(m => m.id === chatMessageDto.id);
         if (msg) msg.deleted = true;
         return;
      }

      const privateKey = this.key.sessionPrivateKey;

      if (privateKey) {
        try {
          chatMessageDto.message = await this.decryptMessage(chatMessageDto.message, privateKey);
          // Auto-read receipt logic
          if (chatMessageDto.user === this.activeFrien) {
             const readReceipt = new ChatMessageDto(this.jwtdeco.getID(), "", "", chatMessageDto.user, true, new Date().toISOString(), "READ", true);
             this.webSocket.send(JSON.stringify(readReceipt));
          } else if (chatMessageDto.user !== this.jwtdeco.getID()) {
             const currentUnread = new Map(this.unreadCounts);
             const count = currentUnread.get(chatMessageDto.user) || 0;
             currentUnread.set(chatMessageDto.user, count + 1);
             this.unreadCounts = currentUnread;
             this.unreadCounts$.next(this.unreadCounts);
          }
          this.chatMessages.push(chatMessageDto);
        } catch (error) {
          console.error('Error decrypting incoming message:', error);
        }
      } else {
        console.error('Cannot decrypt incoming message: Private key missing in memory.');
      }
      });
    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
      if (!this.isIntentionalClose) {
          this.scheduleReconnect();
      }
    };

    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.webSocket.close();
    };
  }

  private scheduleReconnect() {
    setTimeout(() => {
        console.log(`Reconnecting in ${this.reconnectInterval}ms...`);
        this.openWebSocket();
        this.reconnectInterval = Math.min(this.reconnectInterval * 2, this.maxReconnectInterval);
    }, this.reconnectInterval);
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
    this.isIntentionalClose = true;
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
