export class StringConstants {
  LOGIN = 'login';

  //others
  LOCAL_STORAGE_KEY = 'my_app_state';
  applicationJSON = { 'Content-Type': 'application/json' };

  // http methods
  GET = 'GET';
  POST = 'POST';
  PUT = 'PUT';

  // reducer type

  LOG_IN = 'LOG_IN';
  LOG_OUT = 'LOG_OUT';
  Announcement = 'Announcement';
  Name = 'Name';
  placeBidding = 'placeBidding';
  UserWallet = 'UserWallet';
  isLoading = 'isLoading';
  RESET_PASSWORD = 'RESET_PASSWORD';


  // custom status code
  Void_StatusCode = 400322
  Anouncement_StatusCode = 40030

}


let strings = new StringConstants();
export default strings;
