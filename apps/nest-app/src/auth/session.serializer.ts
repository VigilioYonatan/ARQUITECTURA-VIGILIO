import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): void {
    done(null, user.id);
  }

  async deserializeUser(
    payload: string,
    done: (err: Error, user: any) => void,
  ): Promise<void> {
    const user = await this.usersService.findOneById(payload);
    done(null, user);
  }
}
