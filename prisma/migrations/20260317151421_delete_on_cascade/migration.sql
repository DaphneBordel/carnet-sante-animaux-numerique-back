-- DropForeignKey
ALTER TABLE `antiparasitaire` DROP FOREIGN KEY `Antiparasitaire_animalId_fkey`;

-- DropForeignKey
ALTER TABLE `medicament` DROP FOREIGN KEY `Medicament_traitementId_fkey`;

-- DropForeignKey
ALTER TABLE `poids` DROP FOREIGN KEY `Poids_animalId_fkey`;

-- DropForeignKey
ALTER TABLE `traitement` DROP FOREIGN KEY `Traitement_animalId_fkey`;

-- DropForeignKey
ALTER TABLE `vaccin` DROP FOREIGN KEY `Vaccin_animalId_fkey`;

-- DropForeignKey
ALTER TABLE `vermifuge` DROP FOREIGN KEY `Vermifuge_animalId_fkey`;

-- DropIndex
DROP INDEX `Antiparasitaire_animalId_fkey` ON `antiparasitaire`;

-- DropIndex
DROP INDEX `Medicament_traitementId_fkey` ON `medicament`;

-- DropIndex
DROP INDEX `Poids_animalId_fkey` ON `poids`;

-- DropIndex
DROP INDEX `Traitement_animalId_fkey` ON `traitement`;

-- DropIndex
DROP INDEX `Vaccin_animalId_fkey` ON `vaccin`;

-- DropIndex
DROP INDEX `Vermifuge_animalId_fkey` ON `vermifuge`;

-- AddForeignKey
ALTER TABLE `Antiparasitaire` ADD CONSTRAINT `Antiparasitaire_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `Animal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medicament` ADD CONSTRAINT `Medicament_traitementId_fkey` FOREIGN KEY (`traitementId`) REFERENCES `Traitement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Poids` ADD CONSTRAINT `Poids_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `Animal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Traitement` ADD CONSTRAINT `Traitement_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `Animal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vaccin` ADD CONSTRAINT `Vaccin_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `Animal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vermifuge` ADD CONSTRAINT `Vermifuge_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `Animal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
