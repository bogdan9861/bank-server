-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "sum" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
