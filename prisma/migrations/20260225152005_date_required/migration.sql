/*
  Warnings:

  - Made the column `genre` on table `animal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `antiparasitaire` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `vaccin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `vermifuge` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `animal` MODIFY `genre` ENUM('FEMELLE', 'MALE') NOT NULL;

-- AlterTable
ALTER TABLE `antiparasitaire` MODIFY `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `vaccin` MODIFY `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `vermifuge` MODIFY `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
