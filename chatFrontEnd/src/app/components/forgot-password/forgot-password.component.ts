import { Component, ViewEncapsulation } from '@angular/core';
declare var PupilMovement:any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ForgotPasswordComponent {

    constructor() { }

    ngOnInit() {
      PupilMovement.init();
    }

}
