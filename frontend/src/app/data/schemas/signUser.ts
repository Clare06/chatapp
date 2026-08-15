export class SignUser {
  userid: string;
  username: string;
  firstName?: string;
  lastName?: string;
  passwordhash: string;
  email: string;
  publicKey: string;
  encryptedPrivateKey: string;

  constructor(userid: string, username: string, password: string, email: string, publicKey: string, encryptedPrivateKey: string, firstName?: string, lastName?: string) {
    this.userid = userid;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.passwordhash = password;
    this.email = email;
    this.publicKey = publicKey;
    this.encryptedPrivateKey = encryptedPrivateKey;
  }
}
