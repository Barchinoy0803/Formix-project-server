import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'nestjs-cloudinary';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { FormModule } from './form/form.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserAuthModule } from './user-auth/user-auth.module';
import { MailModule } from './mail/mail.module';
import { TemplateModule } from './template/template.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { OptionsModule } from './options/options.module';
import { AnalyzeModule } from './analyze/analyze.module';
import { TagModule } from './tag/tag.module';
import { CommentModule } from './comment/commen.module';
import { LikeModule } from './likes/likes.module';

@Module({
  imports: [
    UserModule,
    FormModule,
    QuestionModule,
    AnswerModule,
    PrismaModule,
    UserAuthModule,
    MailModule,
    TemplateModule,
    FileUploadModule,
    AnalyzeModule,
    TagModule,
    CommentModule,
    LikeModule,
    OptionsModule,
    CloudinaryModule.forRootAsync({
      useFactory: () => ({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      }),
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
