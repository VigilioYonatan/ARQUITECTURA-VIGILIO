import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
// Simulación de base de datos
@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      roles: ['user'],
      ...user,
    } as User;
    this.users.push(newUser);
    return newUser;
  }
}
