import type { UserAuth } from "@modules/users/schemas/user.schema";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../services/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: "email", // We use email as username
        });
    }

    async validate(email: string, pass: string): Promise<UserAuth> {
        const user = await this.authService.validateUser(email, pass);
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }
        return user;
    }
}
