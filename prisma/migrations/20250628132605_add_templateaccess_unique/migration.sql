/*
  Warnings:

  - A unique constraint covering the columns `[templateId,userId]` on the table `TemplateAccess` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TemplateAccess_templateId_userId_key" ON "TemplateAccess"("templateId", "userId");
