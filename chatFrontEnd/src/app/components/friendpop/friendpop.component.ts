import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-friendpop',
  templateUrl: './friendpop.component.html',
  styleUrls: ['./friendpop.component.css']
})
export class FriendpopComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  
}
