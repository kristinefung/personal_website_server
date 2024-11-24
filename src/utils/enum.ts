/************************************************************************
 *                           User related
 ************************************************************************/
export enum UserRole {
    ADMIN = 0,
    USER = 1,
    DEMO = 2,
}

export enum UserStatus {
    ACTIVE = 0,
    UNVERIFIED = 1, // Email not verified
    PENDING = 2, // Pending admin activate account manually
    SUSPENDED = 3, // Temporarily cannot login
    BANNED = 4, // Permanently banned
    LOCKED = 5, // Too many failed attempts, would store last user status
    DELETED = 6, // Account deleted, no longer accessible
}

/************************************************************************
 *                           API related
 ************************************************************************/
export enum ApiStatusCode {
    SUCCESS = "SUCCESS",
    UNAUTHORIZED = "UNAUTHORIZED",
    INVALID_ARGUMENT = "INVALID_ARGUMENT",
    DATABASE_ERROR = "DATABASE_ERROR",
    SYSTEM_ERROR = "SYSTEM_ERROR",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
}