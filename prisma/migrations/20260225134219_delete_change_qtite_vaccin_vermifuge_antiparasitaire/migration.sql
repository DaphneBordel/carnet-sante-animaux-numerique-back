/*
  Warnings:

  - You are about to alter the column `qtite` on the `antiparasitaire` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `qtite` on the `vermifuge` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `antiparasitaire` MODIFY `qtite` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `vermifuge` MODIFY `qtite` VARCHAR(191) NOT NULL;
