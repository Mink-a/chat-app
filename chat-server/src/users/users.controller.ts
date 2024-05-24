import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { IRoom } from '../chat/types';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/rooms')
  async getAllRooms(): Promise<IRoom[]> {
    return await this.usersService.getRooms();
  }

  @Get('rooms/:name')
  async getRoom(@Param() params: { name: string }): Promise<IRoom> {
    const rooms = await this.usersService.getRooms();
    const room = await this.usersService.getRoomByName(params.name);
    return rooms[room];
  }
}
