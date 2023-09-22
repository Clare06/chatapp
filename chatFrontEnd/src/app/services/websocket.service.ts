import { Injectable } from '@angular/core';
import { ChatMessageDto } from '../schemas/chatMessageDto';
import { JwtService } from './jwtservice.service';
import { SharedchatService } from './sharedchat.service';
import { Status } from '../schemas/enum';
import { SharedService } from './shared.service';
import { KeypairService } from './keypair.service';
import { db } from '../indexdb/db';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from '../endpoints/rest-endpoints';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  index: number = 0;
  pubKey: string = "";
  webSocket!: WebSocket;
  userID!:string;
  chatMessages: ChatMessageDto[] = [];
  // activeChat: ChatMessageDto[] = [];
  activeFrien: string = "";
  constructor(private http:HttpClient,private jwtgetid:JwtService, private shared:SharedService,private jwtdeco:JwtService, private key:KeypairService) {
     this.shared.triggerFunction$.subscribe((event) => {
      this.activeFrien=event.value;
     })
     this.userID=jwtdeco.getID();
     this.pubKey=this.jwtdeco.getPubKey();

      // Assuming you have imported the necessary dependencies

// ...

this.http.get<ChatMessageDto[]>(ENDPOINTS.GETMESSAGE + this.jwtdeco.getID()).subscribe(async (data) => {
  const serverData = data;

  // Use Promise.all to await all asynchronous operations
  this.chatMessages = await Promise.all(serverData.map(async (item) => {
    const user = db.getUserByName(this.jwtdeco.getUserName());

    try {
      const data = await user;
      const dbKey = data?.hiddenInfo?.encryptedPrivateKey;

      if (dbKey) {
        // Import the private key from base64
        const privateKey = await this.key.importPrivateKeyFromBase64(dbKey);

        if (item.user === this.jwtdeco.getID()) {
          const decryptedMessage = await this.decryptMessage(item.senderMessage, privateKey);
          item.senderMessage = decryptedMessage;
        } else {
          const decryptedMessage = await this.decryptMessage(item.message, privateKey);
          item.message = decryptedMessage;
        }
      } else {
        console.error('Private key not found in data?.hiddenInfo');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    return new ChatMessageDto(
      item.user,
      item.senderMessage,
      item.message,
      item.sendTo,
      item.status
    );
  }));

  console.log("websocke " + this.chatMessages[0]?.message);
});

     


  }
  ngOnInit(): void {



  }
  public openWebSocket(){

    const userId = this.jwtgetid.getID(); // Replace with the actual user ID
    this.webSocket = new WebSocket(`ws://localhost:8080/chat?${encodeURIComponent(userId)}`);

    this.webSocket.onopen = (event) => {
      console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event) => {
      const chatMessageDto = JSON.parse(event.data);

      const user = db.getUserByName(this.jwtdeco.getUserName());

    user.then(async (data) => {
      const dbKey = data?.hiddenInfo?.encryptedPrivateKey;

      if (dbKey) {
        // Import the private key from base64
        try {
          const privateKey = await this.key.importPrivateKeyFromBase64(dbKey);
          const decryptedMessage = await this.decryptMessage(chatMessageDto.message, privateKey);
          chatMessageDto.message = decryptedMessage;
          this.chatMessages.push(chatMessageDto);
          console.log('Private key imported:', privateKey);
          console.log('Message: ', chatMessageDto);
        } catch (error) {
          console.error('Error importing private key:', error);
        }
      } else {
        console.error('Private key not found in data?.hiddenInfo');
      }
    });

    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };
  }

  public sendMessage(chatMessageDto: ChatMessageDto) {
    this.webSocket.send(JSON.stringify(chatMessageDto));
    console.log('Message sent: ', JSON.stringify(chatMessageDto));

    const user = db.getUserByName(this.jwtdeco.getUserName());

    user.then(async (data) => {
      const dbKey = data?.hiddenInfo?.encryptedPrivateKey;

      if (dbKey) {
        // Import the private key from base64
        try {
          const privateKey = await this.key.importPrivateKeyFromBase64(dbKey);
          const decryptedMessage = await this.decryptMessage(chatMessageDto.senderMessage, privateKey);
          chatMessageDto.senderMessage = decryptedMessage;
          this.chatMessages.push(chatMessageDto);
          console.log('Private key imported:', privateKey);
        } catch (error) {
          console.error('Error importing private key:', error);
        }
      } else {
        console.error('Private key not found in data?.hiddenInfo');
      }
    });
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
  async decryptMessage(encryptedMessageBase64: string, privateKey: CryptoKey): Promise<string> {
    try {
      // Convert the Base64-encoded encrypted message back to an ArrayBuffer
      const encryptedMessageBuffer = new Uint8Array(
        atob(encryptedMessageBase64)
          .split('')
          .map((char) => char.charCodeAt(0))
      );

      // Decrypt the message using the recipient's private key
      const decryptedMessageBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP',
        },
        privateKey,
        encryptedMessageBuffer
      );

      // Convert the decrypted message ArrayBuffer to a string
      const decryptedMessage = new TextDecoder().decode(decryptedMessageBuffer);

      return decryptedMessage;
    } catch (error) {
      // Handle decryption errors
      console.error('Error decrypting the message:', error);
      throw error; // You can handle the error further up the call stack if needed
    }
  }

}
