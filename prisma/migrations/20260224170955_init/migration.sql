-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Animaux` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `dateNaissance` DATETIME(3) NOT NULL,
    `type` ENUM('CHIEN', 'CHAT', 'OISEAU', 'POISSON', 'CHEVAUX', 'RONGEUR', 'REPTILE', 'AUTRE') NOT NULL,
    `poids` DOUBLE NOT NULL,
    `espece` VARCHAR(191) NOT NULL,
    `icad` VARCHAR(191) NOT NULL,
    `pbSante` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Traitement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `animauxId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medicament` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `dosage` VARCHAR(191) NOT NULL,
    `nbJour` INTEGER NOT NULL,
    `traitementId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Antiparasitaire` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `qtite` DOUBLE NOT NULL,
    `dateRappel` DATETIME(3) NOT NULL,
    `animauxId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vermifuge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `qtite` DOUBLE NOT NULL,
    `dateRappel` DATETIME(3) NOT NULL,
    `animauxId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vaccin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `qtite` DOUBLE NOT NULL,
    `dateRappel` DATETIME(3) NOT NULL,
    `animauxId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Animaux` ADD CONSTRAINT `Animaux_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Traitement` ADD CONSTRAINT `Traitement_animauxId_fkey` FOREIGN KEY (`animauxId`) REFERENCES `Animaux`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medicament` ADD CONSTRAINT `Medicament_traitementId_fkey` FOREIGN KEY (`traitementId`) REFERENCES `Traitement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Antiparasitaire` ADD CONSTRAINT `Antiparasitaire_animauxId_fkey` FOREIGN KEY (`animauxId`) REFERENCES `Animaux`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vermifuge` ADD CONSTRAINT `Vermifuge_animauxId_fkey` FOREIGN KEY (`animauxId`) REFERENCES `Animaux`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vaccin` ADD CONSTRAINT `Vaccin_animauxId_fkey` FOREIGN KEY (`animauxId`) REFERENCES `Animaux`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
