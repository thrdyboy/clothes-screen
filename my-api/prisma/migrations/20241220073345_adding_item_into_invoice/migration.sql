-- CreateTable
CREATE TABLE `_InvoiceToItem` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_InvoiceToItem_AB_unique`(`A`, `B`),
    INDEX `_InvoiceToItem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_InvoiceToItem` ADD CONSTRAINT `_InvoiceToItem_A_fkey` FOREIGN KEY (`A`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_InvoiceToItem` ADD CONSTRAINT `_InvoiceToItem_B_fkey` FOREIGN KEY (`B`) REFERENCES `Item`(`cartId`) ON DELETE CASCADE ON UPDATE CASCADE;
