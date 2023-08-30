export class ChatMessageDto {
  user: string ;
  message: string;
  sendTo: string ;
  status: boolean;

  constructor(user: string , message: string, sendTo: string, status: boolean){
      this.user = user;
      this.message = message;
      this.sendTo=sendTo;
      this.status=status;
  }
}
