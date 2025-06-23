/*
  Warnings:

  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Student` table. All the data in the column will be lost.
  - The primary key for the `Teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the `_StudentClass` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Made the column `classId` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_id_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "_StudentClass" DROP CONSTRAINT "_StudentClass_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentClass" DROP CONSTRAINT "_StudentClass_B_fkey";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "classId" SET NOT NULL,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Teacher_pkey" PRIMARY KEY ("userId");

-- DropTable
DROP TABLE "_StudentClass";

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
