/*
  Warnings:

  - Added the required column `name` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Node` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `element` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `node` ADD COLUMN `name` VARCHAR(191) NOT NULL;
