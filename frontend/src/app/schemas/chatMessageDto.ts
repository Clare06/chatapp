export class ChatMessageDto {
  user: string;
  senderMessage: string;
  message: string;
  sendTo: string;
  status: boolean;
  timestamp: string;
  type?: string;
  read?: boolean;

  constructor(user: string, senderMessage: string, message: string, sendTo: string, status: boolean, timestamp: string, type: string = 'MESSAGE', read: boolean = false) {
      this.user = user;
      this.senderMessage = senderMessage;
      this.message = message;
      this.sendTo = sendTo;
      this.status = status;
      this.timestamp = timestamp;
      this.type = type;
      this.read = read;
  }
}
