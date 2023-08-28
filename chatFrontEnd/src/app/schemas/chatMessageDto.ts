export class ChatMessageDto {
  user: string ;
  message: string;
  sendTo: string ;

  constructor(user: string , message: string, sendTo: string){
      this.user = user;
      this.message = message;
      this.sendTo=sendTo;
  }
}
