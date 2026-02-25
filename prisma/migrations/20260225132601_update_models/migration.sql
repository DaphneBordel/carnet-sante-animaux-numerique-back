/*
  Warnings:

  - You are about to drop the column `animauxId` on the `antiparasitaire` table. All the data in the column will be lost.
  - You are about to drop the column `animauxId` on the `traitement` table. All the data in the column will be lost.
  - You are about to drop the column `animauxId` on the `vaccin` table. All the data in the column will be lost.
  - You are about to drop the column `animauxId` on the `vermifuge` table. All the data in the column will be lost.
  - You are about to drop the `animaux` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `animalId` to the `Antiparasitaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `animalId` to the `Traitement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `animalId` to the `Vaccin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `animalId` to the `Vermifuge` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `animaux` DROP FOREIGN KEY `Animaux_userId_fkey`;

-- DropForeignKey
ALTER TABLE `antiparasitaire` DROP FOREIGN KEY `Antiparasitaire_animauxId_fkey`;

-- DropForeignKey
ALTER TABLE `poids` DROP FOREIGN KEY `Poids_animalId_fkey`;

-- DropForeignKey
ALTER TABLE `traitement` DROP FOREIGN KEY `Traitement_animauxId_fkey`;

-- DropForeignKey
ALTER TABLE `vaccin` DROP FOREIGN KEY `Vaccin_animauxId_fkey`;

-- DropForeignKey
ALTER TABLE `vermifuge` DROP FOREIGN KEY `Vermifuge_animauxId_fkey`;

-- DropIndex
DROP INDEX `Antiparasitaire_animauxId_fkey` ON `antiparasitaire`;

-- DropIndex
DROP INDEX `Traitement_animauxId_fkey` ON `traitement`;

-- DropIndex
DROP INDEX `Vaccin_animauxId_fkey` ON `vaccin`;

-- DropIndex
DROP INDEX `Vermifuge_animauxId_fkey` ON `vermifuge`;

-- AlterTable
ALTER TABLE `antiparasitaire` DROP COLUMN `animauxId`,
    ADD COLUMN `animalId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `traitement` DROP COLUMN `animauxId`,
    ADD COLUMN `animalId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `vaccin` DROP COLUMN `animauxId`,
    ADD COLUMN `animalId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `vermifuge` DROP COLUMN `animauxId`,
    ADD COLUMN `animalId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `animaux`;

-- CreateTable
CREATE TABLE `Animal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `dateNaissance` DATETIME(3) NOT NULL,
    `type` ENUM('CHIEN', 'CHAT', 'OISEAU', 'POISSON', 'CHEVAUX', 'RONGEUR', 'REPTILE', 'AUTRE') NOT NULL,
    `espece` VARCHAR(191) NULL,
    `icad` VARCHAR(191) NULL,
    `pbSante` VARCHAR(191) NULL,
    `image` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `couleur` VARCHAR(191) NULL,

    INDEX `Animal_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Antiparasitaire_animalId_fkey` ON `Antiparasitaire`(`animalId`);

-- CreateIndex
CREATE INDEX `Traitement_animalId_fkey` ON `Traitement`(`animalId`);

-- CreateIndex
CREATE INDEX `Vaccin_animalId_fkey` ON `Vaccin`(`animalId`);

-- CreateIndex
CREATE INDEX `Vermifuge_animalId_fkey` ON `Vermifuge`(`animalId`);

-- AddForeignKey
ALTER TABLE `Animal` ADD CONSTRAINT `Animal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Antiparasitaire` ADD CONSTRAINT `Antiparasitaire_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `Animal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Poids` ADD CONSTRAINT `Poids_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `Animal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Traitement` ADD CONSTRAINT `Traitement_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `Animal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vaccin` ADD CONSTRAINT `Vaccin_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `Animal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vermifuge` ADD CONSTRAINT `Vermifuge_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `Animal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
