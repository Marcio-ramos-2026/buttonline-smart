/*
  Warnings:

  - You are about to drop the column `cronVoucher` on the `config` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `config` DROP COLUMN `cronVoucher`,
    ADD COLUMN `date` DATETIME(3) NULL;
