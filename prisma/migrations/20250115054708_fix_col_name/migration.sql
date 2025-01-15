/*
  Warnings:

  - You are about to drop the column `esen_name` on the `editor_icons` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `editor_icons_category_ptbr_name_enus_name_esen_name_idx` ON `editor_icons`;

-- AlterTable
ALTER TABLE `editor_icons` DROP COLUMN `esen_name`,
    ADD COLUMN `eses_name` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `editor_icons_category_ptbr_name_enus_name_eses_name_idx` ON `editor_icons`(`category`, `ptbr_name`, `enus_name`, `eses_name`);
