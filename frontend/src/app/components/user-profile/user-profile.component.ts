import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwtservice.service';
import { ENDPOINTS } from 'src/app/endpoints/rest-endpoints';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() openSettingsEvent = new EventEmitter<void>();

  profile: any = {
    userid: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    publickey: ''
  };
  
  isEditing = false;
  successMsg = '';
  errorMsg = '';
  isSaving = false;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    const userid = this.jwtService.getID();
    this.http.get(ENDPOINTS.GET_PROFILE + userid).subscribe({
      next: (data: any) => {
        this.profile = data;
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.errorMsg = 'Failed to load profile data.';
      }
    });
  }

  toggleEdit() {
    if (this.isEditing) {
      this.loadProfile(); // Reset changes
    }
    this.isEditing = !this.isEditing;
    this.successMsg = '';
    this.errorMsg = '';
  }

  openSettings() {
    this.close.emit();
    this.openSettingsEvent.emit();
  }

  saveProfile() {
    this.isSaving = true;
    this.successMsg = '';
    this.errorMsg = '';
    
    this.http.put(ENDPOINTS.UPDATE_PROFILE, this.profile, { responseType: 'text' }).subscribe({
      next: (newToken: string) => {
        this.isSaving = false;
        this.isEditing = false;
        this.successMsg = 'Profile updated successfully!';
        
        // Update token in localStorage so subsequent requests use the new token
        localStorage.setItem('token', newToken);
        
        // The token contains the new username, but the JWT service gets its info from localStorage
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Failed to update profile', err);
        if (err.status === 409) {
           this.errorMsg = 'Email is already taken by another user.';
        } else {
           this.errorMsg = 'Failed to update profile. Please try again.';
        }
      }
    });
  }
}
