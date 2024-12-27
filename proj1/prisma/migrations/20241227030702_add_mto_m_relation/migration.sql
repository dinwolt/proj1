/*
  Warnings:

  - You are about to drop the `_elementtonode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_elementtonode` DROP FOREIGN KEY `_ElementToNode_A_fkey`;

-- DropForeignKey
ALTER TABLE `_elementtonode` DROP FOREIGN KEY `_ElementToNode_B_fkey`;

-- DropTable
DROP TABLE `_elementtonode`;

-- CreateTable
CREATE TABLE `_NodeToElement` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_NodeToElement_AB_unique`(`A`, `B`),
    INDEX `_NodeToElement_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_NodeToElement` ADD CONSTRAINT `_NodeToElement_A_fkey` FOREIGN KEY (`A`) REFERENCES `Element`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NodeToElement` ADD CONSTRAINT `_NodeToElement_B_fkey` FOREIGN KEY (`B`) REFERENCES `Node`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
