export enum ResponseCode {
    // HTTP Status 200
    SUCCESS = "SU",
  
    // HTTP Status 400
    VALIDATION_FAILED = "VF",
    DUPLICATE_EMAIL = "DE",
    DUPLICATE_NICKNAME = "DN",
    DUPLICATE_TEL_NUMBER = "DT",
    DUPLICATE_ID = "DI",
    NOT_EXISTED_USER = "NU",
    NOT_EXISTED_GAME_SERVER = "NS",
    NOT_ADMIN = "NA",
    NOT_EXISTED_GAME = "NG",
    NOT_EXISTED_CHAT = "NC",
  
  
    // HTTP Status 401
    SIGN_IN_FAIL = "SF",
    AUTHORIZATION_FAIL = "AF",
    CERTIFICATION_FAIL = "CF",
    PASSWORD_FAIL = "PF",
  
    // HTTP Status 403
    NO_PERMISSION = "NP",
  
    // HTTP Status 500
    MAIL_FAIL = "MF",
    NOTIFICATION_FAIL = "NF",
    DATABASE_ERROR = "DBE",
  }
  
  export default ResponseCode;