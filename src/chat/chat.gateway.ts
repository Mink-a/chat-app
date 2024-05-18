import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { TextGenerationService } from './text-generation.service';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  private readonly llm = new TextGenerationService();

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client id:${client.id} disconnected`);
  }

  async generateQuote(text: string) {
    this.io.emit('generating', true);
    const chain = await this.llm.quoteGenerator(text);
    const botMessage = {
      text: `${text}${chain}`,
      name: 'Bot',
      id: `${Math.random()}`,
      socketID: 'botSocketID',
    };
    this.io.emit('generating', false);
    return botMessage;
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    /*
    data = {
      "id": "IooQxYro0BveZQkSAAAH0.6140824888992134",
      "name": "user",
      "text": "nice",
      "socketID": "IooQxYro0BveZQkSAAAH"
    }
    */
    this.io.emit('message', data);
    const botMessage = await this.generateQuote(data.text);

    return {
      event: 'message',
      data: botMessage,
    };
  }
}
