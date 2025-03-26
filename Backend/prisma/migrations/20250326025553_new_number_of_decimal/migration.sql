/*
  Warnings:

  - You are about to alter the column `descuento` on the `contrato` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,1)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `contrato` MODIFY `descuento` DECIMAL(10, 2) NOT NULL;
