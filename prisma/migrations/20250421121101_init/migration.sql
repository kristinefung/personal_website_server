-- AlterTable
ALTER TABLE `Education` MODIFY `deleted` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Enquiry` MODIFY `deleted` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `UserLoginLog` MODIFY `deleted` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Work` MODIFY `deleted` BOOLEAN NULL DEFAULT false;
