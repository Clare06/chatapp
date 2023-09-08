const root="http://10.10.21.162:8080";

export const ENDPOINTS = {
  LOGIN: `${root}/authenticate`,
  GETFRIEND: `${root}/friend-ids/`,
  GETREQ: `${root}/get-req/`,
  ACCEPTFRIEND: `${root}/add-friend`,
  DECLINE:`${root}/decline-req`,
  SEARCHUSER: `${root}/search/`,
  SENDREQ: `${root}/add-friend-req`,
  GETSENT: `${root}/getsentreq/`,
  SIGNUP: `${root}/signup`
}
