enum ResposneMessage{

    SUCCESS = "Success.",

    VALIDATION_FAILED = "Validation failed",
    DUPLICATE_EMAIL = "Duplicate email",
    DUPLICATE_NICKNAME = "Duplicate nickname",
    DUPLICATE_TEL_NUMBER = "Duplicate tel number",
    DUPLICATE_ID = "Duplicate Id",
    NOT_EXISTED_USER = "This user does not exist",
    NOT_EXISTED_BOARD = "This board does not exist",
    NOT_EXISTED_GAME_SERVER = "This game server does not exist",
    NOT_ADMIN = "Only Admin can post new game",
    NOT_EXISTED_GAME = "This game does not exist",
    NOT_EXISTED_CHAT = "This chat does not exist",
    SERVER_EXIST = "Game servers must not exist",

    SIGN_IN_FAIL = "Login information mismatch",
    AUTHORIZATION_FAIL = "Authorization fail",
    CERTIFICATION_FAIL = "Certification failed",
    PASSWORD_FAIL = "Password failed",

    NO_PERMISSION = "Do not have permission",

    MAIL_FAIL = "Mail send failed.",
    NOTIFICATION_FAIL = "Notification send Failed",
    DATABASE_ERROR = "Database error",
}
export default ResposneMessage;