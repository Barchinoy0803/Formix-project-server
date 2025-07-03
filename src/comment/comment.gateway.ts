import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { WsJwtGuard } from '../guards/ws-jwt.guard';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/comments' })
@UseGuards(WsJwtGuard)
export class CommentGateway {
  constructor(private readonly commentService: CommentService) { }

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('comment:new')
  async handleNewComment(
    @MessageBody() dto: CreateCommentDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    const comment = await this.commentService.createComment(dto, user.id);
    client.join(dto.templateId);
    this.server.to(dto.templateId).emit('comment:new', comment);
  }

  @SubscribeMessage('comment:getAll')
  async handleGetAllComments(
    @MessageBody() templateId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (!templateId) throw new WsException('templateId required');
    const comments = await this.commentService.findAllByTemplate(templateId);

    client.join(templateId);
    client.emit('comment:getAll', comments);
  }

  @SubscribeMessage('comment:update')
  async handleUpdateComment(
    @MessageBody()
    data: { id: string; updateData: UpdateCommentDto; templateId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    const existing = await this.commentService.findOne(data.id);
    if (existing.userId !== user.id) throw new WsException('Forbidden');
    const updated = await this.commentService.updateComment(
      data.id,
      data.updateData,
    );
    this.server.to(data.templateId).emit('comment:updated', updated);
  }

  @SubscribeMessage('comment:delete')
  async handleDeleteComment(
    @MessageBody() data: { id: string; templateId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    const existing = await this.commentService.findOne(data.id);
    if (existing.userId !== user.id) throw new WsException('Forbidden');
    await this.commentService.deleteComment(data.id);
    client.join(data.templateId);
    this.server.to(data.templateId).emit('comment:delete', data.id, data.templateId);
  }
}
