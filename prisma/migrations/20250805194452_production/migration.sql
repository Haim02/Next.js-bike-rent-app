/*
  Warnings:

  - Added the required column `updateAt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "createdAt" SET DATA TYPE DATE,
ALTER COLUMN "updateAt" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" DATE NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DATA TYPE DATE,
ALTER COLUMN "updateAt" SET DATA TYPE DATE;
