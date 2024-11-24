/*
  Warnings:

  - Made the column `company_name` on table `enquiry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_no` on table `enquiry` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `enquiry` MODIFY `company_name` VARCHAR(191) NOT NULL,
    MODIFY `phone_no` VARCHAR(191) NOT NULL;
