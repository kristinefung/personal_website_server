/************************************************************************
 *                           User related
 ************************************************************************/
export enum UserRole {
    ADMIN = 1,
    USER = 2,
    DEMO = 3,
}

export enum UserStatus {
    ACTIVE = 1,
    UNVERIFIED = 2, // Email not verified
    PENDING = 3, // Pending admin activate account manually
    SUSPENDED = 4, // Temporarily cannot login
    BANNED = 5, // Permanently banned
    LOCKED = 6, // Too many failed attempts, would store last user status
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