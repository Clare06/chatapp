import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NewlineToBrPipe } from 'src/app/shared/pipes/newline-to-br.pipe';

import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, AfterViewChecked, signal, computed, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/data/endpoints/rest-endpoints';
import { ChatMessageDto } from 'src/app/data/schemas/chatMessageDto';
import { Status } from 'src/app/data/schemas/enum';
import { JwtService } from 'src/app/core/services/jwtservice.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NewlineToBrPipe],

  selector: 'app-chat-message-container',
  templateUrl: './chat-message-container.component.html',
  styleUrls: ['./chat-message-container.component.css']
})
export class ChatMessageContainerComponent implements AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
[x: string]: any;
  activeFrienSignal = signal<string>("");
  
  get activeFrien(): string {
    return this.activeFrienSignal();
  }
  set activeFrien(val: string) {
    this.activeFrienSignal.set(val);
  }

  usrID: string  = "";
  publickey: string = "";
  friendKeys:any;
  message: any;
  lastTypingTime: number = 0;
  searchQuery: string = "";
  blockedUsers: string[] = [];
  isBlockedByMe: boolean = false;
  constructor(public webSocketService: WebsocketService, public jwtdeco:JwtService,
     private http:HttpClient, private router:Router,
     private shared:SharedService, private cdr: ChangeDetectorRef) {
      this.shared.triggerFunction$.subscribe((event) => {
        console.log('ChatMessageContainer: Received trigger for friend:', event.value);
        this.activeFrien = event.value;
        this.checkIfBlocked();
        this.ngOnInit();
        this.cdr.detectChanges();
    });
}
ngOnInit(): void {
  this.usrID = this.jwtdeco.getID();
  this.publickey = this.jwtdeco.getPubKey();
  this.http.get(ENDPOINTS.GETKEY+this.usrID).subscribe(
    (data) => {
      this.friendKeys = data;
    }
  );

  this.loadBlockedUsers();
}

loadBlockedUsers() {
  this.http.get<string[]>(ENDPOINTS.GET_BLOCKED + this.usrID).subscribe({
    next: (data) => {
      this.blockedUsers = data;
      this.checkIfBlocked();
    }
  });
}

checkIfBlocked() {
  this.isBlockedByMe = this.blockedUsers ? this.blockedUsers.includes(this.activeFrien) : false;
}

blockUser() {
  if (confirm(`Are you sure you want to block ${this.activeFrien}? You won't receive messages from them.`)) {
    this.http.post(ENDPOINTS.BLOCK_USER, { userid: this.usrID, friendid: this.activeFrien }, { responseType: 'text' }).subscribe({
      next: () => {
        this.loadBlockedUsers();
      }
    });
  }
}

unblockUser() {
  if (confirm(`Are you sure you want to unblock ${this.activeFrien}?`)) {
    this.http.post(ENDPOINTS.UNBLOCK_USER, { userid: this.usrID, friendid: this.activeFrien }, { responseType: 'text' }).subscribe({
      next: () => {
        this.loadBlockedUsers();
      }
    });
  }
}

ngAfterViewChecked() {
    this.scrollToBottom();
}

scrollToBottom(): void {
    try {
        if (this.myScrollContainer) {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }
    } catch(err) { }
}

shouldShowDate(currentMessage:ChatMessageDto, currentIndex:number, allMessages: ChatMessageDto[]): boolean {
  if (currentIndex === 0) {
    return true;
  }
  const currentMessageDate = this.getDatePart(currentMessage.timestamp);
  const previousMessage = allMessages[currentIndex - 1];
  const previousMessageDate = this.getDatePart(previousMessage.timestamp);


  return currentMessageDate !== previousMessageDate;
  // return currentMessage.timestamp !== previousMessage.timestamp;
}
getDatePart(timestamp: string): string {
  return new Date(timestamp).toISOString().split('T')[0];
}

isToday(timestamp: string): boolean {
  const today = new Date();
  const datePart = this.getDatePart(timestamp);
  const todayDatePart = this.getDatePart(today.toISOString());

  return datePart === todayDatePart;
}

async encryptMessage(message: string, recipientPublicKey: string): Promise<string> {
  try {
    const publicKey = await this.importPublicKeyFromPEM(recipientPublicKey);

    const messageBuffer = new TextEncoder().encode(message);

    const encryptedMessage = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      messageBuffer
    );

    const encryptedMessageBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedMessage)));

    return encryptedMessageBase64;
  } catch (error) {
    // Handle encryption errors
    console.error('Error encrypting the message:', error);
    throw error; // You can handle the error further up the call stack if needed
  }
}

  async sendMessage(sendForm: NgForm) {
    const message = sendForm.value.message;

  if (!message) {
    return;
  }



  const recipientPublicKey = this.friendKeys[this.activeFrien];
  if (!recipientPublicKey) {

    console.error(`Recipient's public key not found for user ${this.activeFrien}`);
    return;
  }

    try {
    const encryptedSenderMessage = await this.encryptMessage(message, this.publickey);
    const encryptedMessage = await this.encryptMessage(message, recipientPublicKey);
    const newDate = new Date();

    const chatMessageDto = new ChatMessageDto(this.usrID,encryptedSenderMessage ,encryptedMessage, this.activeFrien, true,this.formatDate(newDate));

    this.webSocketService.sendMessage(chatMessageDto);
    sendForm.controls['message'].reset();
  } catch (error) {
    console.error('Error encrypting the message:', error);
  }
  }

  deleteMessage(msg: ChatMessageDto) {
    if (confirm("Are you sure you want to delete this message?")) {
      this.http.delete(`${ENDPOINTS.DELETEMESSAGE}/${msg.id}/${this.jwtdeco.getID()}`, { responseType: 'text' }).subscribe({
         next: () => {
             msg.deleted = true;
             const deleteNotice = new ChatMessageDto(this.usrID, "", "", this.activeFrien, true, new Date().toISOString(), 'DELETE', false, msg.id);
             this.webSocketService.sendMessage(deleteNotice);
         },
         error: (err) => {
             console.error('Failed to delete', err);
         }
      });
    }
  }

  onTyping() {
    const now = Date.now();
    if (now - this.lastTypingTime > 1500 && this.activeFrien) {
      this.lastTypingTime = now;
      const typingMsg = new ChatMessageDto(this.usrID, "", "", this.activeFrien, true, new Date().toISOString(), 'TYPING', false);
      this.webSocketService.webSocket.send(JSON.stringify(typingMsg));
    }
  }


  formatDate(date: Date): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss.SSS')!;
  }

  getFilteredMessages(): ChatMessageDto[] {
      let msgs = this.webSocketService.filterChatMessages();
      if (this.searchQuery && this.searchQuery.trim() !== "") {
          const lowerQuery = this.searchQuery.toLowerCase();
          msgs = msgs.filter(msg => {
              if (msg.deleted) return false;
              if (msg.user === this.usrID) {
                  return msg.senderMessage?.toLowerCase().includes(lowerQuery);
              } else {
                  return msg.message?.toLowerCase().includes(lowerQuery);
              }
          });
      }
      return msgs;
  }

  async importPublicKeyFromPEM(pemPublicKey: string): Promise<CryptoKey> {
    const pemHeader = '-----BEGIN PUBLIC KEY-----';
    const pemFooter = '-----END PUBLIC KEY-----';
    const pemContents = pemPublicKey
      .replace(pemHeader, '')
      .replace(pemFooter, '')
      .replace(/\s/g, '');

    const binaryDer = atob(pemContents);
    const publicKeyBuffer = new Uint8Array(binaryDer.length);
    for (let i = 0; i < binaryDer.length; i++) {
      publicKeyBuffer[i] = binaryDer.charCodeAt(i);
    }

    return await window.crypto.subtle.importKey(
      'spki',
      publicKeyBuffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['encrypt']
    );
  }


}
