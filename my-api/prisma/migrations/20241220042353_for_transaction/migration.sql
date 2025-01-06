-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `from` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clothes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `front` VARCHAR(191) NULL,
    `rightSide` VARCHAR(191) NULL,
    `leftSide` VARCHAR(191) NULL,
    `behind` VARCHAR(191) NULL,
    `screenPrinting` VARCHAR(191) NULL,
    `nameClothes` VARCHAR(191) NULL,
    `namePrinting` VARCHAR(191) NULL,

    UNIQUE INDEX `Clothes_nameClothes_key`(`nameClothes`),
    UNIQUE INDEX `Clothes_namePrinting_key`(`namePrinting`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `cartId` INTEGER NOT NULL AUTO_INCREMENT,
    `customerID` INTEGER NOT NULL,
    `price` INTEGER NULL,

    UNIQUE INDEX `Item_customerID_key`(`customerID`),
    PRIMARY KEY (`cartId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentCode` VARCHAR(191) NOT NULL,
    `dateIssued` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Invoice_paymentCode_key`(`paymentCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ClothesToItem` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ClothesToItem_AB_unique`(`A`, `B`),
    INDEX `_ClothesToItem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_customerID_fkey` FOREIGN KEY (`customerID`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ClothesToItem` ADD CONSTRAINT `_ClothesToItem_A_fkey` FOREIGN KEY (`A`) REFERENCES `Clothes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ClothesToItem` ADD CONSTRAINT `_ClothesToItem_B_fkey` FOREIGN KEY (`B`) REFERENCES `Item`(`cartId`) ON DELETE CASCADE ON UPDATE CASCADE;
