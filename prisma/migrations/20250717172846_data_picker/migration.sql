/*
  Warnings:

  - The values [REJECT,APPROVE] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `city` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseNumber` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "Message" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Message" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Message" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropIndex
DROP INDEX "Message_productId_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "houseNumber" INTEGER NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "street" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AvailableSlot" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hour" TEXT NOT NULL,

    CONSTRAINT "AvailableSlot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AvailableSlot" ADD CONSTRAINT "AvailableSlot_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
