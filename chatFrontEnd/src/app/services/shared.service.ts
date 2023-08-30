import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ChatMessageDto } from '../schemas/chatMessageDto';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private triggerFunctionSubject = new Subject<any>();

  triggerFunction$ = this.triggerFunctionSubject.asObservable();

  triggerFunction(value: any, chat: ChatMessageDto[]) {
    const paylod ={value,chat}
    this.triggerFunctionSubject.next(paylod);
  }
}
