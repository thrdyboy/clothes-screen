/*
  Warnings:

  - You are about to alter the column `taxprice` on the `item` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the `_clothestoitem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clothesID]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clothesID` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_clothestoitem` DROP FOREIGN KEY `_ClothesToItem_A_fkey`;

-- DropForeignKey
ALTER TABLE `_clothestoitem` DROP FOREIGN KEY `_ClothesToItem_B_fkey`;

-- AlterTable
ALTER TABLE `item` ADD COLUMN `clothesID` INTEGER NOT NULL,
    MODIFY `taxprice` DOUBLE NULL;

-- DropTable
DROP TABLE `_clothestoitem`;

-- CreateIndex
CREATE UNIQUE INDEX `Item_clothesID_key` ON `Item`(`clothesID`);

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_clothesID_fkey` FOREIGN KEY (`clothesID`) REFERENCES `Clothes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
