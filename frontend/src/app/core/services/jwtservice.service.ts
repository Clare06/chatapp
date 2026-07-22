import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  userID!: string;
  userName!: string;
  publickey!: string;
  verify: boolean = false;

  private decodeToken(rawToken: string): any {
    try {
      const token = rawToken.replace(/^"(.*)"$/, '$1');
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("JWT Decode Error:", e);
      return null;
    }
  }

  tokenCache: string | null = null;
  public getToken(): string | null {
    if (this.tokenCache) return this.tokenCache;
    this.tokenCache = localStorage.getItem('token');
    return this.tokenCache;
  }

  public getID(): string {
    if (this.userID) return this.userID;
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.decodeToken(token);
      if (decoded) {
        this.userID = decoded.userid;
        return this.userID;
      }
    }
    return "";
  }

  public getUserName(): string {
    if (this.userName) return this.userName;
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.decodeToken(token);
      if (decoded) {
        this.userName = decoded.username;
        return this.userName;
      }
    }
    return "";
  }

  public getVerify(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.decodeToken(token);
      if (decoded) {
        this.verify = decoded.verify;
        return this.verify;
      }
    }
    return this.verify;
  }

  public getPubKey(): string {
    if (this.publickey) return this.publickey;
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.decodeToken(token);
      if (decoded) {
        this.publickey = decoded.publickey;
        return this.publickey;
      }
    }
    return "";
  }
}
