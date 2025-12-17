import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {
    type Profile,
    Strategy,
    type StrategyOptions,
} from "passport-google-oauth20";
import { AuthService } from "../services/auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(
        configService: ConfigService,
        private readonly authService: AuthService
    ) {
        super({
            clientID: configService.get("GOOGLE_CLIENT_ID") || "mock_id",
            clientSecret:
                configService.get("GOOGLE_CLIENT_SECRET") || "mock_secret",
            callbackURL:
                configService.get("GOOGLE_CALLBACK_URL") || "mock_callback",
            scope: ["email", "profile"],
        } as StrategyOptions);
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: Profile
    ) {
        // Validate or register user based on profile
        const user = await this.authService.validateGoogleUser(profile);
        return user;
    }
}
