export class ChatMessageDto {
  user: string ;
  senderMessage: string ;
  message: string;
  sendTo: string ;
  status: boolean;

  constructor(user: string ,senderMessage:string, message: string, sendTo: string, status: boolean){
      this.user = user;
      this.senderMessage=senderMessage;
      this.message = message;
      this.sendTo=sendTo;
      this.status=status;
  }
}
