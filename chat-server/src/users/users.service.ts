import { Injectable } from '@nestjs/common';
import { IRoom, IUser } from '../chat/types';

const DEFAULT_ROOMS: Array<IRoom> = [
  {
    name: 'room-1',
    host: {
      socketId: 'n6wiTBGp5Cja8F0qAAAB',
      id: '1,670,466,928,442Anna',
      name: 'Anna',
    },
    users: [
      {
        socketId: 'n6wiTBGp5Cja8F0qAAAB',
        id: '1,670,466,928,442Anna',
        name: 'Anna',
      },
      {
        socketId: '58r6srrtvBQP-o1pAAAD',
        id: '1,670,463,510,408Austin',
        name: 'Austin',
      },
    ],
  },
  {
    name: 'room-2',
    host: {
      socketId: '5orXGez8W05N793CAAAF',
      id: '1,670,510,121,768Meeko',
      name: 'Meeko',
    },
    users: [
      {
        socketId: '5orXGez8W05N793CAAAF',
        id: '1,670,510,121,768Meeko',
        name: 'Meeko',
      },
    ],
  },
];

@Injectable()
export class UsersService {
  private rooms: IRoom[] = DEFAULT_ROOMS;

  async getRooms(): Promise<IRoom[]> {
    return this.rooms;
  }

  async addRoom(roomName: string, host: IUser): Promise<void> {
    const room = await this.getRoomByName(roomName);

    if (room === -1) {
      this.rooms.push({ name: roomName, host: host, users: [host] });
    }
  }

  async removeRoom(roomName: string): Promise<void> {
    const findRoom = await this.getRoomByName(roomName);
    if (findRoom !== -1) {
      this.rooms = this.rooms.filter((room) => room.name !== roomName);
    }
  }

  async addUserToRoom(roomName: string, user: IUser): Promise<void> {
    const roomIndex = await this.getRoomByName(roomName);
    if (roomIndex !== -1) {
      this.rooms[roomIndex].users.push(user);
      const host = await this.getRoomHost(roomName);
      if (host.id === user.id) {
        this.rooms[roomIndex].host.socketId = user.socketId;
      }
    } else {
      await this.addRoom(roomName, user);
    }
  }

  async removeUserFromAllRooms(socketId: string): Promise<void> {
    const rooms = await this.findRoomsByUserSocketId(socketId);
    for (const room of rooms) {
      await this.removeUserFromRoom(socketId, room.name);
    }
  }

  /* Helper funcs */
  async getRoomHost(hostName: string): Promise<IUser> {
    const roomIndex = await this.getRoomByName(hostName);
    return this.rooms[roomIndex].host;
  }

  async getRoomByName(roomName: string): Promise<number> {
    const roomIndex = this.rooms.findIndex((room) => room?.name === roomName);
    return roomIndex;
  }

  async findRoomsByUserSocketId(socketId: string): Promise<IRoom[]> {
    const filteredRooms = this.rooms.filter((room) => {
      const found = room.users.find((user) => user.socketId === socketId);
      if (found) {
        return found;
      }
    });
    return filteredRooms;
  }

  async removeUserFromRoom(socketId: string, roomName: string): Promise<void> {
    const room = await this.getRoomByName(roomName);
    this.rooms[room].users = this.rooms[room].users.filter(
      (user) => user.socketId !== socketId,
    );
    if (this.rooms[room].users.length === 0) {
      await this.removeRoom(roomName);
    }
  }
}
