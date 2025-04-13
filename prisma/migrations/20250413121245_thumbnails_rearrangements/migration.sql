/*
  Warnings:

  - You are about to drop the column `isFeatured` on the `Thumbnail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Thumbnail" DROP COLUMN "isFeatured",
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;
