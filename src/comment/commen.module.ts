import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentGateway } from './comment.gateway';

@Module({
    controllers: [],
    providers: [CommentService, CommentGateway],
})
export class CommentModule { }
