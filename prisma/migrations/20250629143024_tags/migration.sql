/*
  Warnings:

  - You are about to drop the column `templateId` on the `Tags` table. All the data in the column will be lost.
  - Added the required column `tagId` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_templateId_fkey";

-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "templateId";

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "tagId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
