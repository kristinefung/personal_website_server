export enum USER_ROLE {
    ADMIN = 0,
    USER = 1,
    DEMO = 2,
}

export enum USER_STATUS {
    ACTIVE = 0,
    UNVERIFIED = 1, // Email not verified
    PENDING = 2, // Pending admin activate account manually
    SUSPENDED = 3, // Temporarily cannot login
    BANNED = 4, // Permanently banned
    LOCKED = 5, // Too many failed attempts, would store last user status
    DELETED = 6, // Account deleted, no longer accessible
}
