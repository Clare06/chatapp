import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ENDPOINTS } from 'src/app/endpoints/rest-endpoints';
import { ChatMessageDto } from 'src/app/schemas/chatMessageDto';
import { Status } from 'src/app/schemas/enum';
import { JwtService } from 'src/app/services/jwtservice.service';
import { SharedService } from 'src/app/services/shared.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-chat-message-container',
  templateUrl: './chat-message-container.component.html',
  styleUrls: ['./chat-message-container.component.css']
})
export class ChatMessageContainerComponent {
[x: string]: any;
  activeFrien: string = "";
  usrID: string  = "";
  publickey: string = "";
  friendKeys:any;
  message: any;
  constructor(public webSocketService: WebsocketService, public jwtdeco:JwtService,
     private http:HttpClient, private router:Router,
     private shared:SharedService) {
      this.shared.triggerFunction$.subscribe((event) => {
        this.activeFrien=event.value;
        this.ngOnInit();
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

}

shouldShowDate(currentMessage:ChatMessageDto, currentIndex:number): boolean {
  if (currentIndex === 0) {
    return true;
  }
  const currentMessageDate = this.getDatePart(currentMessage.timestamp);
  const previousMessage = this.webSocketService.filterChatMessages()[currentIndex - 1];
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


  formatDate(date: Date): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss.SSS')!;
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
