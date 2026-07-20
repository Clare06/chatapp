import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtService } from '../../services/jwtservice.service';
import { KeypairService } from '../../services/keypair.service';
import { ENDPOINTS } from '../../endpoints/rest-endpoints';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  @Output() close = new EventEmitter<void>();
  
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  
  message = '';
  isError = false;
  isLoading = false;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private keypairService: KeypairService
  ) {}

  async onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'New passwords do not match!';
      this.isError = true;
      return;
    }

    if (!this.oldPassword || !this.newPassword) {
      this.message = 'Please fill all fields';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.isError = false;

    try {
      const privateKey = this.keypairService.sessionPrivateKey;
      if (!privateKey) {
        throw new Error('Private key not loaded in session!');
      }

      // Re-encrypt the private key with the NEW password
      const newEncryptedPrivateKey = await this.keypairService.encryptPrivateKeyWithPassword(privateKey, this.newPassword);

      const requestBody = {
        userid: this.jwtService.getID(),
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        newEncryptedPrivateKey: newEncryptedPrivateKey
      };

      this.http.post(ENDPOINTS.CHANGE_PASSWORD, requestBody, { responseType: 'text' }).subscribe({
        next: (res) => {
          this.message = 'Password changed successfully!';
          this.isError = false;
          this.isLoading = false;
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        },
        error: (err) => {
          this.message = err.error || 'Failed to change password. Ensure old password is correct.';
          this.isError = true;
          this.isLoading = false;
        }
      });
    } catch (err: any) {
      this.message = 'Error during key re-encryption.';
      this.isError = true;
      this.isLoading = false;
      console.error(err);
    }
  }

  closeModal() {
    this.close.emit();
  }
}
