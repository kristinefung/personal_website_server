-- AlterTable
ALTER TABLE `UserLoginLog` MODIFY `ipAddress` VARCHAR(191) NULL,
    MODIFY `userAgent` VARCHAR(191) NULL,
    MODIFY `sessionToken` VARCHAR(500) NULL,
    MODIFY `logoutAt` DATETIME(3) NULL;
