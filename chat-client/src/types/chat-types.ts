export interface IUser {
  id: string;
  name: string;
  socketId: string;
}

export interface IRoom {
  name: string;
  host: IUser;
  users: Array<IUser>;
}

export interface IMessage {
  id: string;
  user: IUser;
  message: string;
  roomName: string;
  timeSent: string;
}
