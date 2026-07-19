import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-keystore',
  templateUrl: './keystore.component.html',
  styleUrls: ['./keystore.component.css']
})
export class KeystoreComponent implements OnInit {
  set: boolean = false;
  errr: string = "This email verification method has been deprecated for security reasons.";

  constructor(private router: Router) {}

  ngOnInit(): void {
    // The previous implementation of sending private keys via email in URLs was a critical security flaw.
    // This route is now disabled. Users should login directly to generate or access their keys securely.
    setTimeout(() => {
        this.router.navigate(['../login']);
    }, 3000);
  }
}
