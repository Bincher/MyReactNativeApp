export enum ResponseCode {
    // HTTP Status 200
    SUCCESS = "SU",
  
    // HTTP Status 400
    VALIDATION_FAIL = "VF",
    DUPLICATE_ID = "DI",
    DUPLICATE_EMAIL = "DE",
    DUPLICATE_NICKNAME = "DN",
    DUPLICATE_TEL_NUMBER = "DT",
    NOT_EXISTED_USER = "NU",
    NOT_EXISTED_BOARD = "NB",
  
    // HTTP Status 401
    SIGN_IN_FAIL = "SF",
    AUTHORIZATION_FAIL = "AF",
    CERTIFICATION_FAIL = "CF",
  
    // HTTP Status 403
    NO_PERMISSION = "NP",
  
    // HTTP Status 500
    MAIL_FAIL = "MF",
    NOTIFICATION_FAIL = "NF",
    DATABASE_ERROR = "DBE",
  }
  
  export default ResponseCode;