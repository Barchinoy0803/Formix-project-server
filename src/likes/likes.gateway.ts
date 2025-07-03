import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikeService } from './likes.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class LikeGateway {
    constructor(private readonly likeService: LikeService) { }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('like:toggle')
    async handleLikeToggle(
        @MessageBody() data: CreateLikeDto,
        @ConnectedSocket() client: Socket
    ) {
        try {
            const user = client.data.user;
            if (!user?.id) {
                client.emit('like:error', { message: 'Unauthorized user' });
                return;
            }

            const result = await this.likeService.create(data, { userId: user.id });
            this.server.emit('like:updated', {
                templateId: data.templateId,
                message: result.message,
            });
        } catch (error) {
            console.error(error);
            client.emit('like:error', { message: 'Failed to toggle like' });
        }
    }

    @SubscribeMessage('like:getAll')
    async handleGetAllLikes(@ConnectedSocket() client: Socket) {
        try {
            const likes = await this.likeService.findAllTemplateLikes();
            client.emit('like:getAll', likes);
        } catch (error) {
            console.error(error);
            client.emit('like:error', { message: 'Failed to fetch likes' });
        }
    }
}
