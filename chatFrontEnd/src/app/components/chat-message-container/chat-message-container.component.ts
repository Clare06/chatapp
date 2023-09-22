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
  activeFrien: string = "";
  usrID: string  = "";
  publickey: string = "";
  friendKeys:any;
  message: any;
  // chat: ChatMessageDto[] = [];
  constructor(public webSocketService: WebsocketService, public jwtdeco:JwtService,
     private http:HttpClient, private router:Router,
     private shared:SharedService) {
      this.shared.triggerFunction$.subscribe((event) => {
        this.activeFrien=event.value;
        // this.chat=event.chat;
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
async encryptMessage(message: string, recipientPublicKey: string): Promise<string> {
  try {
    // Parse the recipient's PEM public key and convert it to CryptoKey
    const publicKey = await this.importPublicKeyFromPEM(recipientPublicKey);

    // Convert the message to ArrayBuffer
    const messageBuffer = new TextEncoder().encode(message);

    // Encrypt the message using the recipient's public key
    const encryptedMessage = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      messageBuffer
    );

    // Convert the encrypted message to Base64 for easier transmission
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
    return; // Exit if the message is empty
  }

  // Check if the recipient's public key is available

  const recipientPublicKey = this.friendKeys[this.activeFrien];
  if (!recipientPublicKey) {
    // Handle the case where the recipient's public key is not available
    console.error(`Recipient's public key not found for user ${this.activeFrien}`);
    return;
  }

    try {
    // Encrypt the message using the recipient's public key
    const encryptedSenderMessage = await this.encryptMessage(message, this.publickey);
    const encryptedMessage = await this.encryptMessage(message, recipientPublicKey);

    // Create a ChatMessageDto with the encrypted message
    const chatMessageDto = new ChatMessageDto(this.usrID,encryptedSenderMessage ,encryptedMessage, this.activeFrien, true);

    // Send the encrypted message
    this.webSocketService.sendMessage(chatMessageDto);
    sendForm.controls['message'].reset();
  } catch (error) {
    // Handle encryption errors
    console.error('Error encrypting the message:', error);
  }
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
