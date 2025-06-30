import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommentGateway {
  constructor(private readonly commentService: CommentService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('comment:new')
  async handleNewComment(
    @MessageBody() data: CreateCommentDto,
    @ConnectedSocket() client: Socket
  ) {
    const user = client.data.user;
    if (!user?.id) {
      client.emit('comment:error', { message: 'Unauthorized user' });
      return;
    }

    const comment = await this.commentService.createComment(data, user.id);
    this.server.emit('comment:new', comment);
  }

  @SubscribeMessage('comment:getAll')
  async handleGetAllComments(@ConnectedSocket() client: Socket) {
    const comments = await this.commentService.findAll();
    client.emit('comment:getAll', comments);
  }

  @SubscribeMessage('comment:update')
  async handleUpdateComment(
    @MessageBody() data: { id: string; updateData: UpdateCommentDto },
    @ConnectedSocket() client: Socket
  ) {
    const user = client.data.user;
    if (!user?.id) {
      client.emit('comment:error', { message: 'Unauthorized user' });
      return;
    }

    const existingComment = await this.commentService.findOne(data.id);
    if (existingComment.userId !== user.id) {
      client.emit('comment:error', { message: 'You cannot update this comment' });
      return;
    }

    const updated = await this.commentService.updateComment(data.id, data.updateData);
    this.server.emit('comment:updated', updated);
  }

  @SubscribeMessage('comment:delete')
  async handleDeleteComment(
    @MessageBody() data: { id: string },
    @ConnectedSocket() client: Socket
  ) {
    const user = client.data.user;
    if (!user?.id) {
      client.emit('comment:error', { message: 'Unauthorized user' });
      return;
    }

    const existingComment = await this.commentService.findOne(data.id);
    if (existingComment.userId !== user.id) {
      client.emit('comment:error', { message: 'You cannot delete this comment' });
      return;
    }

    await this.commentService.deleteComment(data.id);
    this.server.emit('comment:deleted', { id: data.id });
  }
}
