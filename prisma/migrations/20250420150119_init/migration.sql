-- DropForeignKey
ALTER TABLE `Education` DROP FOREIGN KEY `Education_updatedBy_fkey`;

-- AlterTable
ALTER TABLE `Education` MODIFY `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedBy` INTEGER NULL DEFAULT 0,
    MODIFY `deleted` TINYINT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Enquiry` MODIFY `deleted` TINYINT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `User` MODIFY `deleted` TINYINT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `UserLoginLog` MODIFY `deleted` TINYINT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Work` MODIFY `deleted` TINYINT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Education` ADD CONSTRAINT `Education_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
