import { Module } from '@nestjs/common';
import { LikeService } from './likes.service';
import { LikeGateway } from './likes.gateway';

@Module({
    controllers: [],
    providers: [LikeService, LikeGateway],
})
export class LikeModule { }
