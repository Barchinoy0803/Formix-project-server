import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QUESTION_ANSWER_TYPE, Answer, Options, SelectedOptionOnAnswer } from '@prisma/client';

type AnswerWithRelations = Answer & {
  user: { id: string; username: string };
  selectedOptionOnAnswer: (SelectedOptionOnAnswer & { option: Options })[];
};

@Injectable()
export class AnalyzeService {
  constructor(private readonly prisma: PrismaService) { }

  async findAnalyzeForQuestion(id: string) {
    try {
      const question = await this.prisma.question.findUnique({ where: { id } });
      if (!question) return null;

      const answers = (await this.prisma.answer.findMany({
        where: { questionId: id },
        include: {
          user: { select: { id: true, username: true } },
          selectedOptionOnAnswer: {
            where: { isSelected: true },
            include: { option: { select: { id: true, title: true } } },
          },
        },
      })) as AnswerWithRelations[];

      switch (question.type) {
        case QUESTION_ANSWER_TYPE.OPEN:
          return { answers, questionType: question.type }
        case QUESTION_ANSWER_TYPE.NUMERICAL:
          return { answers, questionType: question.type };

        case QUESTION_ANSWER_TYPE.CLOSE: {
          const yesCount = answers.filter(a => a.answer === 'YES').length;
          const total = answers.length || 1;
          const yesPercent = Number(((yesCount / total) * 100).toFixed(1));
          return { YES: yesPercent, NO: 100 - yesPercent, answers, questionType: question.type };
        }
        case QUESTION_ANSWER_TYPE.MULTICHOICE: {
          const counter = new Map<string, { title: string; count: number }>();

          for (const ans of answers) {
            for (const sel of ans.selectedOptionOnAnswer) {
              const key = sel.optionId;
              const entry = counter.get(key);
              if (entry) entry.count += 1;
              else counter.set(key, { title: sel.option.title, count: 1 });
            }
          }

          const totalSelections =
            [...counter.values()].reduce((a, v) => a + v.count, 0) || 1;

          const stats = [...counter.entries()]
            .map(([optionId, { title, count }]) => ({
              optionId,
              title,
              count,
              percentage: Number(
                ((count / totalSelections) * 100).toFixed(2),
              ),
            }))
            .sort((a, b) => b.count - a.count);

          return { totalSelections, stats, answers, questionType: question.type };
        }
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
