export class SignUser {
  userid: string;
  username: string;
  passwordhash: string;
  email: string;
  publicKey: string;
  encryptedPrivateKey: string;

  constructor(userid: string, username: string, password: string, email: string, publicKey: string, encryptedPrivateKey: string) {
    this.userid = userid;
    this.username = username;
    this.passwordhash = password;
    this.email = email;
    this.publicKey = publicKey;
    this.encryptedPrivateKey = encryptedPrivateKey;
  }
}
