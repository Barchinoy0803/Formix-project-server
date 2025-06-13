import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FormModule } from './form/form.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserAuthModule } from './user-auth/user-auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [UserModule, FormModule, QuestionModule, AnswerModule, PrismaModule, UserAuthModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
