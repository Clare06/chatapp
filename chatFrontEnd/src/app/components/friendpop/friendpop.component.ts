import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, interval, map, of, startWith, switchMap } from 'rxjs';
import { ENDPOINTS } from 'src/app/endpoints/rest-endpoints';
import { SenderReciever } from 'src/app/schemas/senderReciever';
import { JwtService } from 'src/app/services/jwtservice.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-friendpop',
  templateUrl: './friendpop.component.html',
  styleUrls: ['./friendpop.component.css'],

})
export class FriendpopComponent implements OnInit {

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() friendReqs: EventEmitter<any> = new EventEmitter();

  friendReq: string[] = [];
  usrID: string = "";
  mess:string="";
  searchQuery: string = '';
  searchResults:string[] = [];
  reqsAvailable:boolean= false ;
  sentReq:string[] = [];

  sentReq$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private http:HttpClient, private jwt:JwtService) { }
  sendFriendRequest() {
    // You can emit data along with the event if needed

  }
  ngOnInit(): void {
    this.usrID = this.jwt.getID();
    this.http.get<string[]>(ENDPOINTS.GETREQ+this.usrID).subscribe(
      (data) => {
        this.friendReq = data;
        this.reqsAvailable= this.friendReq.length > 0;
        const eventData = data.length;
        this.friendReqs.emit(eventData);
      }
    )

    this.getSentReq().subscribe((data)=>{
      this.sentReq=data;
      this.sentReq$.next(data);
    })
  }
  acceptFriend(frd:string,index:number){
    const senderReciever= new SenderReciever(this.usrID, frd);
    this.http.post(ENDPOINTS.ACCEPTFRIEND,senderReciever, {responseType: 'text'}).subscribe(
      (data) => {
          this.mess=data;
          this.friendReq.splice(index,1);
          this.reqsAvailable= this.friendReq.length > 0;
          this.friendReqs.emit(this.friendReq.length);
      }
    )


  }

  rejectFriend(frd: string,index:number) {

    const senderReciever= new SenderReciever(this.usrID, frd);
    this.http.put(ENDPOINTS.DECLINE,senderReciever, {responseType: 'text'}).subscribe(
      (data) => {
          this.mess=data;
          this.friendReq.splice(index,1);
          this.reqsAvailable= this.friendReq.length > 0;
          this.friendReqs.emit(this.friendReq.length);
      }
    )


    }

    onSearch(){
      if(this.searchQuery.trim()){
          this.http.get<string[]>(ENDPOINTS.SEARCHUSER+this.usrID+"/"+this.searchQuery).subscribe(
            (data) => {
              this.searchResults = data;
            }
          )
      }else{
        this.searchResults = [];
      }
    }
    addReq(frd:string){
      const senderReciever= new SenderReciever(this.usrID, frd);
      this.http.post(ENDPOINTS.SENDREQ,senderReciever, {responseType: 'text'}).subscribe(
        (data) => {
            this.mess=data;

            this.sentReq.push(frd);
        }
      )

    this.getSentReq().subscribe((data)=>{
      this.sentReq=data;
      this.sentReq$.next(data);
    })
    }
    getSentReq(): Observable<string[]>{
     return this.http.get<string[]>(ENDPOINTS.GETSENT+this.usrID)
    }


    isSent(usr:string): boolean{

      return !this.sentReq.includes(usr);

    }
}
