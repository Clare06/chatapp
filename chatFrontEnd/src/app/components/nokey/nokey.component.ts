import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nokey',
  templateUrl: './nokey.component.html',
  styleUrls: ['./nokey.component.css']
})
export class NokeyComponent {
  constructor(private router: Router){}
  logout(){
    localStorage.removeItem('token');
    this.router.navigate(["/login"])
  }

}
