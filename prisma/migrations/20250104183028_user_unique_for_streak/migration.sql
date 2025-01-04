/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `streak` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "streak_userId_key" ON "streak"("userId");
