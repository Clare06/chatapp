import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private triggerFunctionSubject = new Subject<any>();

  triggerFunction$ = this.triggerFunctionSubject.asObservable();

  triggerFunction(value: any) {
    this.triggerFunctionSubject.next(value);
  }
}
