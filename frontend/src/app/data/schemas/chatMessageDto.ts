export class ChatMessageDto {
  user: string;
  senderMessage: string;
  message: string;
  sendTo: string;
  status: boolean;
  timestamp: string;
  type?: string;
  read?: boolean;
  id?: number;
  deleted?: boolean;
  showDelete?: boolean;

  constructor(user: string, senderMessage: string, message: string, sendTo: string, status: boolean, timestamp: string, type: string = 'MESSAGE', read: boolean = false, id?: number, deleted: boolean = false) {
      this.user = user;
      this.senderMessage = senderMessage;
      this.message = message;
      this.sendTo = sendTo;
      this.status = status;
      this.timestamp = timestamp;
      this.type = type;
      this.read = read;
      this.id = id;
      this.deleted = deleted;
  }
}
