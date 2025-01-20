/*
  Warnings:

  - You are about to drop the column `availableSeats` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `bookingStatus` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "availableSeats",
DROP COLUMN "status",
ADD COLUMN "bookingStatus" TEXT NOT NULL;
