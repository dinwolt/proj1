/*
  Warnings:

  - A unique constraint covering the columns `[name,projectId]` on the table `Node` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Node_name_key` ON `node`;

-- CreateIndex
CREATE UNIQUE INDEX `Node_name_projectId_key` ON `Node`(`name`, `projectId`);
