import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { TextGenerationService } from './text-generation.service';
import { UsersService } from 'src/users/users.service';
import { IUser, IMessage } from './types';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  private readonly llm = new TextGenerationService();
  private readonly usersService = new UsersService();

  @WebSocketServer() io: Server;

  /**
   * This method is called after the gateway is initialized.
   * It logs a message indicating that the gateway has been initialized.
   *
   * @returns {void}
   */
  afterInit(): void {
    this.logger.log('Initialized');
  }

  /**
   * Handles a new client connection.
   *
   * @param {Socket} client - The socket of the connected client.
   * @returns {void}
   */
  handleConnection(client: Socket): void {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  /**
   * Handles a client disconnection.
   *
   * @param {Socket} client - The socket of the disconnected client.
   * @returns {Promise<void>}
   */
  async handleDisconnect(client: Socket): Promise<void> {
    await this.usersService.removeUserFromAllRooms(client.id);
    this.logger.log(`Client id:${client.id} disconnected`);
  }

  /**
   * This method generates a quote by calling the LLM service and constructs a bot message.
   * It emits a 'generating' event before the quote generation and another 'generating' event
   * after the quote generation with the opposite boolean value.
   *
   * @param {string} text - The input text for the quote generation.
   * @returns {Promise<IEvent>} - A promise that resolves to the bot message object.
   */
  async generateQuote(text: string, roomName: string): Promise<IMessage> {
    this.io.to(roomName).emit('generating', true);
    const chain = await this.llm.quoteGenerator(text);
    const botMessage: IMessage = {
      message: `${text}${chain}`,
      user: {
        name: 'Bot',
        id: 'bot-id',
        socketId: 'bot-socket-id',
      },
      id: `Bot${Math.random()}`,
      roomName: roomName,
      timeSent: new Date().toISOString(),
    };
    this.io.to(roomName).emit('generating', false);
    return botMessage;
  }

  /**
   * Handles a message event from a client.
   *
   * @param {Socket} client - The socket of the client that sent the message.
   * @param {IEvent} data - The message data received from the client.
   * @returns {Promise<void>} - A promise that resolves to an object containing the event name and the bot message.
   */
  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    @MessageBody() payload: IMessage,
  ): Promise<void> {
    this.logger.log(`Message received from client id: ${client}`);
    this.logger.log({ payload });
    this.io.to(payload.roomName).emit('message', payload);
    const botMessage = await this.generateQuote(
      payload.message,
      payload.roomName,
    );

    this.io.to(payload.roomName).emit('message', botMessage);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody()
    payload: {
      roomName: string;
      user: IUser;
    },
  ) {
    if (payload.user.socketId) {
      this.logger.log(
        `${payload.user.socketId} is joining ${payload.roomName}`,
      );
      this.io.in(payload.user.socketId).socketsJoin(payload.roomName);
      await this.usersService.addUserToRoom(payload.roomName, payload.user);
    }
  }
}
