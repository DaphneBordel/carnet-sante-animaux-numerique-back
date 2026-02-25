/*
  Warnings:

  - You are about to drop the column `dosage` on the `medicament` table. All the data in the column will be lost.
  - You are about to drop the column `nbJour` on the `medicament` table. All the data in the column will be lost.
  - You are about to drop the column `dateDebut` on the `traitement` table. All the data in the column will be lost.
  - You are about to drop the column `dateFin` on the `traitement` table. All the data in the column will be lost.
  - Added the required column `dateDebut` to the `medicament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateFin` to the `medicament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `posologie` to the `medicament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `medicament` DROP COLUMN `dosage`,
    DROP COLUMN `nbJour`,
    ADD COLUMN `dateDebut` DATETIME(3) NOT NULL,
    ADD COLUMN `dateFin` DATETIME(3) NOT NULL,
    ADD COLUMN `posologie` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `traitement` DROP COLUMN `dateDebut`,
    DROP COLUMN `dateFin`;
