import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ENDPOINTS } from 'src/app/endpoints/rest-endpoints';
import { SenderReciever } from 'src/app/schemas/senderReciever';
import { JwtService } from 'src/app/services/jwtservice.service';

@Component({
  selector: 'app-friendpop',
  templateUrl: './friendpop.component.html',
  styleUrls: ['./friendpop.component.css']
})
export class FriendpopComponent {

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  friendReq: string[] = [];
  usrID: string = "";
  mess:string="";
  searchQuery: string = '';
  searchResults:string[] = [];
  reqsAvailable:boolean= false ;
  // senderReciever: SenderReciever = new SenderReciever("", "");
  constructor(private http:HttpClient, private jwt:JwtService) { }

  ngOnInit(): void {
    this.usrID = this.jwt.getID();
    this.http.get<string[]>(ENDPOINTS.GETREQ+this.usrID).subscribe(
      (data) => {
        this.friendReq = data;
        this.reqsAvailable= this.friendReq.length > 0;
      }
    )

  }
  acceptFriend(frd:string){
    const senderReciever= new SenderReciever(this.usrID, frd);
    // console.log(senderReciever.userid+""+ senderReciever.friendid + "accept");
    // console.log(ENDPOINTS.ACCEPTFRIEND);
    // console.log(this.http.post(ENDPOINTS.ACCEPTFRIEND,senderReciever, {responseType: 'text'}));
    this.http.post(ENDPOINTS.ACCEPTFRIEND,senderReciever, {responseType: 'text'}).subscribe(
      (data) => {
          this.mess=data;
      }
    )
  }

  rejectFriend(frd: string) {
    // throw new Error('Method not implemented.');
    const senderReciever= new SenderReciever(this.usrID, frd);
    this.http.put(ENDPOINTS.DECLINE,senderReciever, {responseType: 'text'}).subscribe(
      (data) => {
          this.mess=data;
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
      // this.http.post(ENDPOINTS.ACCEPTFRIEND,senderReciever, {responseType: 'text'}).subscribe(
      //   (data) => {
      //       this.mess=data;
      //   }
      // )
    }
}
