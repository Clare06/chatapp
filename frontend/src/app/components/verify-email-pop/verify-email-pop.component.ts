import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email-pop',
  templateUrl: './verify-email-pop.component.html',
  styleUrls: ['./verify-email-pop.component.css']
})
export class VerifyEmailPopComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  constructor(private router:Router) { }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(["/login"]).then(()=>{
      window.location.reload();
    })
  }
}
