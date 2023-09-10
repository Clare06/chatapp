export class SignUser {
  userid: string;
  username: string;
  passwordhash: string;
  email: string;


  constructor(userid: string, username: string, password: string, email: string) {
    this.userid = userid;
    this.username = username;
    this.passwordhash = password;
    this.email = email;
  }
}
