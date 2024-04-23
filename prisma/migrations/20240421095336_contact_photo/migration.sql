-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "photo" TEXT NOT NULL DEFAULT '',
    "phoneNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Contacts" ("id", "name", "phoneNumber", "userId") SELECT "id", "name", "phoneNumber", "userId" FROM "Contacts";
DROP TABLE "Contacts";
ALTER TABLE "new_Contacts" RENAME TO "Contacts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
