import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateLikeDto, GetLikesDto } from './dto/create-like.dto';
import { LikeService } from './likes.service';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/guards/ws-jwt.guard';

@WebSocketGateway({
    namespace: '/likes',
    cors: {
        origin: '*',
    },
})

export class LikeGateway {
    constructor(private readonly likeService: LikeService) { }

    @WebSocketServer()
    server: Server;

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('like:toggle')
    async handleLikeToggle(
        @MessageBody() data: CreateLikeDto,
        @ConnectedSocket() client: Socket
    ) {
        try {
            const user = client.data.user;
            if (!user?.id) {
                throw new UnauthorizedException('Unauthorized user');
            }

            const result = await this.likeService.create(data, { userId: user.id });
            const updatedLikes = await this.likeService.findAllTemplateLikes(data.templateId);

            this.server.emit('like:updated', {
                templateId: data.templateId,
                action: result.action,
                count: updatedLikes.count,
                likes: updatedLikes.likes
            });
        } catch (error) {
            console.error(error);
            client.emit('like:error', {
                message: error.message || 'Failed to toggle like',
                code: error.response?.statusCode || 500
            });
        }
    }
    @SubscribeMessage('like:getAll')
    async handleGetAllLikes(
        @MessageBody() data: GetLikesDto,
        @ConnectedSocket() client: Socket
    ) {
        try {
            const result = await this.likeService.findAllTemplateLikes(data.templateId);
            client.emit('like:updated', {
                templateId: data.templateId,
                action: 'none',
                count: result.count,
                likes: result.likes
            });
        } catch (error) {
            client.emit('like:error', {
                message: error.message || 'Failed to fetch likes',
                code: error.response?.statusCode || 500
            });
        }
    }

}