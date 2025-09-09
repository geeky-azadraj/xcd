-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL DEFAULT (UUID()),
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `avatar_url` VARCHAR(500) NULL,
    `phone` VARCHAR(20) NULL,
    `user_type` VARCHAR(50) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    `last_login_at` TIMESTAMP(6) NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_user_type_idx`(`user_type`),
    INDEX `users_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_company_metadata` (
    `id` VARCHAR(191) NOT NULL DEFAULT (UUID()),
    `company_name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `customer_company_metadata_company_name_idx`(`company_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `event_metadata` (
    `id` VARCHAR(191) NOT NULL DEFAULT (UUID()),
    `event_name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `event_metadata_event_name_idx`(`event_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- CreateTable
CREATE TABLE `customers` (
    `id` VARCHAR(191) NOT NULL DEFAULT (UUID()),
    `user_id` VARCHAR(191) NOT NULL UNIQUE,
    `customer_name` VARCHAR(255) NOT NULL,
    `contact_email` VARCHAR(255) NOT NULL,
    `contact_phone` VARCHAR(20) NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `company_name` VARCHAR(255) NULL,
    `location` JSON NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    `total_events` INTEGER NOT NULL DEFAULT 0,
    `created_by` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `customers_user_id_idx`(`user_id`),
    INDEX `customers_status_idx`(`status`),
    INDEX `customers_created_by_idx`(`created_by`),
    INDEX `customers_company_id_idx`(`company_id`),
    UNIQUE INDEX `customers_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create events table
CREATE TABLE `events` (
    `id` VARCHAR(191) NOT NULL DEFAULT (UUID()),
    `customer_id` VARCHAR(191) NOT NULL,
    `event_name` VARCHAR(255) NOT NULL,
    `event_type` VARCHAR(100) NULL,
    `event_description` TEXT NULL,
    `venue_address` JSON NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `booking_start_date` DATE NOT NULL,
    `booking_end_date` DATE NOT NULL,
    `currency_type` VARCHAR(20) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'draft',
    `logo_url` VARCHAR(500) NULL,
    `support_first_name` VARCHAR(255) NULL,
    `support_last_name` VARCHAR(255) NULL,
    `support_email` VARCHAR(255) NULL,
    `support_phone_number` VARCHAR(255) NULL,
    `support_url` VARCHAR(500) NULL,
    `event_category_type` VARCHAR(20) NOT NULL DEFAULT 'general',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),

    INDEX `idx_events_customer_id`(`customer_id`),
    INDEX `idx_events_status`(`status`),
    INDEX `idx_events_start_date`(`start_date`),
    INDEX `idx_events_end_date`(`end_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `customer_company_metadata`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
