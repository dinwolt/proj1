/*
  Warnings:

  - A unique constraint covering the columns `[name,projectId]` on the table `Element` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Element_name_key` ON `element`;

-- CreateIndex
CREATE UNIQUE INDEX `Element_name_projectId_key` ON `Element`(`name`, `projectId`);
