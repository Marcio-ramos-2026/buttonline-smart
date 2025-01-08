/*
  Warnings:

  - You are about to drop the column `object_1` on the `editor_canvas` table. All the data in the column will be lost.
  - You are about to drop the column `object_2` on the `editor_canvas` table. All the data in the column will be lost.
  - You are about to drop the column `object_3` on the `editor_canvas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `editor_canvas` DROP COLUMN `object_1`,
    DROP COLUMN `object_2`,
    DROP COLUMN `object_3`,
    ADD COLUMN `size` LONGTEXT NULL;
