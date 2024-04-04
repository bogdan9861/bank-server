/*
  Warnings:

  - You are about to drop the column `name` on the `History` table. All the data in the column will be lost.
  - Added the required column `recipient` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_History" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sender" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "sum" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_History" ("date", "id", "reason", "sum", "time", "userId") SELECT "date", "id", "reason", "sum", "time", "userId" FROM "History";
DROP TABLE "History";
ALTER TABLE "new_History" RENAME TO "History";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
