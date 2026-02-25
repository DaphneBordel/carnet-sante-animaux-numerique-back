/*
  Warnings:

  - Made the column `dateDebut` on table `traitement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateFin` on table `traitement` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `antiparasitaire` MODIFY `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `dateRappel` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `traitement` MODIFY `dateDebut` DATETIME(3) NOT NULL,
    MODIFY `dateFin` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `vaccin` MODIFY `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `dateRappel` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `vermifuge` MODIFY `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `dateRappel` DATETIME(3) NULL;
