/*
  Warnings:

  - You are about to drop the column `user_id` on the `user_session_token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `user_session_token` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user_session_token` DROP COLUMN `user_id`;

-- CreateIndex
CREATE UNIQUE INDEX `user_session_token_UNIQUE` ON `user_session_token`(`token`);
