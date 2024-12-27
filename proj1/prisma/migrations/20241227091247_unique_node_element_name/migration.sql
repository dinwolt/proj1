/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Element` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Node` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Element_name_key` ON `Element`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Node_name_key` ON `Node`(`name`);
