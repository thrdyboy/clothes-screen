/*
  Warnings:

  - You are about to drop the column `from` on the `customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customer` DROP COLUMN `from`,
    ADD COLUMN `fromOrigin` VARCHAR(191) NULL;
