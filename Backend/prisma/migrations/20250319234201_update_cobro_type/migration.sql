/*
  Warnings:

  - You are about to alter the column `cobro` on the `compra` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,1)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `compra` MODIFY `cobro` DECIMAL(10, 2) NOT NULL;
