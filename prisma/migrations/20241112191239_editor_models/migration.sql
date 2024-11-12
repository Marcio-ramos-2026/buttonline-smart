-- CreateTable
CREATE TABLE `EditorCanvas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `shape` VARCHAR(191) NOT NULL,
    `object_1` LONGTEXT NOT NULL,
    `object_2` LONGTEXT NOT NULL,
    `object_3` LONGTEXT NOT NULL,
    `gabarito` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EditorIcons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `svg` TEXT NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `ptBR_name` VARCHAR(191) NULL,
    `enUS_name` VARCHAR(191) NULL,
    `esEN_name` VARCHAR(191) NULL,
    `enabled` BOOLEAN NULL DEFAULT true,

    INDEX `EditorIcons_category_ptBR_name_enUS_name_esEN_name_idx`(`category`, `ptBR_name`, `enUS_name`, `esEN_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
