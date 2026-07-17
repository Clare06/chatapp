import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedchatService {
  private activeFunctionSubject = new Subject<any>();

  activeFunction$ = this.activeFunctionSubject.asObservable();

  activeFunction(value: number) { 
    this.activeFunctionSubject.next(value);
  }
}
