-- CreateTable
CREATE TABLE "SelectedOptionOnAnswer" (
    "answerId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SelectedOptionOnAnswer_pkey" PRIMARY KEY ("answerId","optionId")
);

-- AddForeignKey
ALTER TABLE "SelectedOptionOnAnswer" ADD CONSTRAINT "SelectedOptionOnAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedOptionOnAnswer" ADD CONSTRAINT "SelectedOptionOnAnswer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
