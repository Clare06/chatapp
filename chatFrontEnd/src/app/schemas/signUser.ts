export class SignUser {
  userid: string;
  username: string;
  passwordhash: string;
  email: string;
  publicKey: string;


  constructor(userid: string, username: string, password: string, email: string, publicKey: string) {
    this.userid = userid;
    this.username = username;
    this.passwordhash = password;
    this.email = email;
    this.publicKey = publicKey;
  }
}
