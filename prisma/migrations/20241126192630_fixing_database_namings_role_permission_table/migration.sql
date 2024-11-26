/*
  Warnings:

  - You are about to drop the column `enUS_name` on the `editor_icons` table. All the data in the column will be lost.
  - You are about to drop the column `esEN_name` on the `editor_icons` table. All the data in the column will be lost.
  - You are about to drop the column `ptBR_name` on the `editor_icons` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the `_PermissionToRole` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_PermissionToRole` DROP FOREIGN KEY `_PermissionToRole_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PermissionToRole` DROP FOREIGN KEY `_PermissionToRole_B_fkey`;

-- DropIndex
DROP INDEX `editor_icons_category_ptBR_name_enUS_name_esEN_name_idx` ON `editor_icons`;

-- AlterTable
ALTER TABLE `editor_icons` DROP COLUMN `enUS_name`,
    DROP COLUMN `esEN_name`,
    DROP COLUMN `ptBR_name`,
    ADD COLUMN `enus_name` VARCHAR(191) NULL,
    ADD COLUMN `esen_name` VARCHAR(191) NULL,
    ADD COLUMN `ptbr_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `permissions` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `roles` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `_PermissionToRole`;

-- CreateTable
CREATE TABLE `role_permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_id` INTEGER NULL,
    `permission_id` INTEGER NULL,

    INDEX `role_permissions_role_id_permission_id_idx`(`role_id`, `permission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `editor_icons_category_ptbr_name_enus_name_esen_name_idx` ON `editor_icons`(`category`, `ptbr_name`, `enus_name`, `esen_name`);

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
