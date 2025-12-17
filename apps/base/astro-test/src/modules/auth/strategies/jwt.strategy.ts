import environments from "@infrastructure/config/server/environments.config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../services/auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: environments().JWT_KEY,
        });
    }

    async validate(payload: { sub: string; email: string }) {
        // We can either fetch the full user from DB or just return keys if we trust the token payload
        // For consistency with Session which returns UserAuth, let's validate properly
        const user = await this.authService.validateUserByEmail(payload.email);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
