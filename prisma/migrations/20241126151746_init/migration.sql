/*
  Warnings:

  - You are about to drop the `UserSessionToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `UserSessionToken`;

-- CreateTable
CREATE TABLE `UserLoginLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `ipAddress` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NOT NULL,
    `failAttempts` INTEGER NOT NULL DEFAULT 0,
    `sessionToken` VARCHAR(500) NOT NULL,
    `loginAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `logoutAt` DATETIME(3) NOT NULL,
    `deleted` TINYINT NOT NULL DEFAULT 0,

    UNIQUE INDEX `sessionToken_UNIQUE`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
