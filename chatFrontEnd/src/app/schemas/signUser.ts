export class SignUser {
  userid: string;
  username: string;
  passwordhash: string;


  constructor(userid: string, username: string, password: string) {
    this.userid = userid;
    this.username = username;
    this.passwordhash = password;
  }
}
