import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class CommentGateway implements OnGatewayInit {
  constructor(private readonly commentService: CommentService) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    server.use((socket, next) => {
      socket.data.user = { id: socket.id };
      next();
    });
  }

  @SubscribeMessage('comment:new')
  async handleNewComment(
    @MessageBody() dto: CreateCommentDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    if (!user?.id) {
      client.emit('comment:error', { message: 'Unauthorized user' });
      return;
    }
    const comment = await this.commentService.createComment(dto, user.id);
    this.server.emit('comment:new', comment);
  }

  @SubscribeMessage('comment:getAll')
  async handleGetAllComments(
    @MessageBody() data: { templateId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const comments = await this.commentService.findAll(data.templateId);
    client.emit('comment:getAll', comments);
  }

  @SubscribeMessage('comment:update')
  async handleUpdateComment(
    @MessageBody() data: { id: string; updateData: UpdateCommentDto },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    if (!user?.id) {
      client.emit('comment:error', { message: 'Unauthorized user' });
      return;
    }
    const existing = await this.commentService.findOne(data.id);
    if (existing.userId !== user.id) {
      client.emit('comment:error', { message: 'You cannot update this comment' });
      return;
    }
    const updated = await this.commentService.updateComment(data.id, data.updateData);
    this.server.emit('comment:updated', updated);
  }

  @SubscribeMessage('comment:delete')
  async handleDeleteComment(
    @MessageBody() data: { id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    if (!user?.id) {
      client.emit('comment:error', { message: 'Unauthorized user' });
      return;
    }
    const existing = await this.commentService.findOne(data.id);
    if (existing.userId !== user.id) {
      client.emit('comment:error', { message: 'You cannot delete this comment' });
      return;
    }
    await this.commentService.deleteComment(data.id);
    this.server.emit('comment:deleted', { id: data.id });
  }
}
