import { environment } from 'src/environments/environment';

const root = environment.apiUrl;
export const ENDPOINTS = {
  LOGIN: `${root}/authenticate`,
  GETFRIEND: `${root}/friend-ids/`,
  GETREQ: `${root}/get-req/`,
  ACCEPTFRIEND: `${root}/add-friend`,
  DECLINE:`${root}/decline-req`,
  SEARCHUSER: `${root}/search/`,
  SENDREQ: `${root}/add-friend-req`,
  GETSENT: `${root}/getsentreq/`,
  SIGNUP: `${root}/signup`,
  FORGOTPASS: `${root}/forgotpass/reset-password`,
  OTP: `${root}/forgotpass/verify-otp`,
  NEWPASS: `${root}/forgotpass/new-pass`,
  GETKEY:`${root}/get-friend-key/`,
  GETMESSAGE:`${root}/messages/`,
  SENDEMAIL:`${root}/send-email`,
  GET_ENCRYPTED_KEY:`${root}/get-encrypted-key/`,
  CHANGE_PASSWORD: `${root}/change-password`,
  DELETEMESSAGE:`${root}/messages`,
  GET_PROFILE: `${root}/profile/`,
  UPDATE_PROFILE: `${root}/profile`,
  BLOCK_USER: `${root}/block`,
  UNBLOCK_USER: `${root}/unblock`,
  GET_BLOCKED: `${root}/blocked/`
}
