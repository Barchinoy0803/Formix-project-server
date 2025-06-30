-- DropForeignKey
ALTER TABLE "SelectedOptionOnAnswer" DROP CONSTRAINT "SelectedOptionOnAnswer_optionId_fkey";

-- AddForeignKey
ALTER TABLE "SelectedOptionOnAnswer" ADD CONSTRAINT "SelectedOptionOnAnswer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
