-- CreateTable
CREATE TABLE `education` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `degree` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `school_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(2000) NOT NULL,
    `start_month` INTEGER NOT NULL,
    `start_year` INTEGER NOT NULL,
    `end_month` INTEGER NOT NULL,
    `end_year` INTEGER NOT NULL,
    `is_current` TINYINT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL DEFAULT 0,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_by` INTEGER NOT NULL DEFAULT 0,
    `deleted` TINYINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
