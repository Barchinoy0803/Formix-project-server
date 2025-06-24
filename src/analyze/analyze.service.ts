import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QUESTION_ANSWER_TYPE } from '@prisma/client';

@Injectable()
export class AnalyzeService {
  constructor(private readonly prisma: PrismaService) { }

  async findQuestionForAnalyze(id: string) {
    try {
      let question = await this.prisma.question.findUnique({ where: { id } })
      const answers = await this.prisma.answer.findMany({ where: { questionId: id }, include: { user: true } })

      switch (question?.type) {
        case QUESTION_ANSWER_TYPE.OPEN:
        case QUESTION_ANSWER_TYPE.NUMERICAL:
          return answers
        case QUESTION_ANSWER_TYPE.CLOSE:
          const yesAnswers = answers.filter(({ answer }) => answer === "YES")
          const result = Number(((yesAnswers.length / answers.length) * 100).toFixed(1))
          return {
            "YES": result,
            "NO": 100 - result,
            answers
          }
        case QUESTION_ANSWER_TYPE.MULTICHOICE:
          console.log(answers);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
