import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var PupilMovement:any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ForgotPasswordComponent {
onSubmit() {
throw new Error('Method not implemented.');
}
  forgotPassForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.forgotPassForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }


    ngOnInit() {
      PupilMovement.init();
    }

}
