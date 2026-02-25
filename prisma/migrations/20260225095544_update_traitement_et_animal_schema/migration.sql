/*
  Warnings:

  - You are about to drop the column `poids` on the `animaux` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `traitement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `animaux` DROP COLUMN `poids`,
    ADD COLUMN `couleur` VARCHAR(191) NULL,
    MODIFY `espece` VARCHAR(191) NULL,
    MODIFY `icad` VARCHAR(191) NULL,
    MODIFY `pbSante` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `traitement` DROP COLUMN `date`,
    ADD COLUMN `dateDebut` DATETIME(3) NULL,
    ADD COLUMN `dateFin` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `Poids` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `kilo` DOUBLE NOT NULL,
    `animalId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Poids` ADD CONSTRAINT `Poids_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `Animaux`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
