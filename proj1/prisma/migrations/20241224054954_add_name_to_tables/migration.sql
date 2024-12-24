-- DropForeignKey
ALTER TABLE `node` DROP FOREIGN KEY `Node_elementId_fkey`;

-- DropIndex
DROP INDEX `Node_elementId_fkey` ON `node`;

-- AlterTable
ALTER TABLE `node` MODIFY `elementId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Node` ADD CONSTRAINT `Node_elementId_fkey` FOREIGN KEY (`elementId`) REFERENCES `Element`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
