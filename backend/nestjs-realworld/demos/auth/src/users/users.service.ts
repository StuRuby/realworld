import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        id: 1,
        name: 'jon',
        password: 'jon123',
      },
      {
        id: 2,
        name: 'jane',
        password: 'jane123',
      },
      {
        id: 3,
        name: 'tom',
        password: 'tom123',
      },
      {
        id: 4,
        name: 'alice',
        password: 'alice123',
      },
    ];
  }

  async findOne(name: string): Promise<User | undefined> {
    return this.users.find(user => user.name === name);
  }
}
