/*
  Warnings:

  - You are about to drop the column `name` on the `element` table. All the data in the column will be lost.
  - You are about to drop the column `elementId` on the `node` table. All the data in the column will be lost.
  - Added the required column `type` to the `Element` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `node` DROP FOREIGN KEY `Node_elementId_fkey`;

-- DropIndex
DROP INDEX `Node_elementId_fkey` ON `node`;

-- AlterTable
ALTER TABLE `element` DROP COLUMN `name`,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `node` DROP COLUMN `elementId`;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `_ElementToNode` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ElementToNode_AB_unique`(`A`, `B`),
    INDEX `_ElementToNode_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ElementToNode` ADD CONSTRAINT `_ElementToNode_A_fkey` FOREIGN KEY (`A`) REFERENCES `Element`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ElementToNode` ADD CONSTRAINT `_ElementToNode_B_fkey` FOREIGN KEY (`B`) REFERENCES `Node`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
