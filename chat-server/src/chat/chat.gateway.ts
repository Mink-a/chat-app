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
import { IEvent } from './types';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  private readonly llm = new TextGenerationService();

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
   * @returns {void}
   */
  handleDisconnect(client: Socket): void {
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
  async generateQuote(text: string): Promise<IEvent> {
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

  /**
   * Handles a message event from a client.
   *
   * @param {Socket} client - The socket of the client that sent the message.
   * @param {IEvent} data - The message data received from the client.
   * @returns {Promise<{ event: string; data: IEvent; }>} - A promise that resolves to an object containing the event name and the bot message.
   */
  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    data: IEvent,
  ): Promise<{ event: string; data: IEvent }> {
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
