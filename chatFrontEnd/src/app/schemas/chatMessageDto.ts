export class ChatMessageDto {
  user: string ;
  senderMessage: string ;
  message: string;
  sendTo: string ;
  status: boolean;
  timestamp: string ;

  constructor(user: string ,senderMessage:string, message: string, sendTo: string, status: boolean, timestamp: string){
      this.user = user;
      this.senderMessage=senderMessage;
      this.message = message;
      this.sendTo=sendTo;
      this.status=status;
      this.timestamp=timestamp;
  }
}
