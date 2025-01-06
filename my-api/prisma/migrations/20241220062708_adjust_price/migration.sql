/*
  Warnings:

  - You are about to drop the column `price` on the `item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `clothes` ADD COLUMN `price` INTEGER NULL;

-- AlterTable
ALTER TABLE `item` DROP COLUMN `price`,
    ADD COLUMN `taxprice` INTEGER NULL;
