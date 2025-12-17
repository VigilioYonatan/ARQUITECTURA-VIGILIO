import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password || ''))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async register(userDto: any) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser = await this.usersService.create({
      ...userDto,
      password: hashedPassword,
    });
    const { password, ...result } = newUser;
    return result;
  }

  async recoverPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      // Por seguridad, no decimos si el usuario existe o no, pero simulamos éxito
      return { message: 'If user exists, email sent' };
    }
    const token = this.jwtService.sign(
      { sub: user.id, purpose: 'reset_password' },
      { expiresIn: '15m' },
    );
    await this.sendResetEmail(email, token);
    return { message: 'If user exists, email sent', mockToken: token };
  }

  private async sendResetEmail(email: string, token: string) {
    // MOCK: Aquí usaríamos Nodemailer o un servicio externo
    console.log(
      `[EMAIL MOCK] Sending password reset to ${email} with token: ${token}`,
    );
  }
}
