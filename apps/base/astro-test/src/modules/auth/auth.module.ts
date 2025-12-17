import environments from "@infrastructure/config/server/environments.config";
import { UserModule } from "@modules/users/modules/user.module";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./controllers/auth.controller";
import { HybridAuthGuard } from "./guards/hybrid.guard";
import { AuthService } from "./services/auth.service";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { SessionSerializer } from "./strategies/session.serializer";

@Module({
    imports: [
        UserModule,
        PassportModule.register({ session: true }),
        JwtModule.register({
            secret: environments().JWT_KEY,
            signOptions: { expiresIn: "30d" }, // Default expiration
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        GoogleStrategy,
        JwtStrategy,
        SessionSerializer,
        HybridAuthGuard,
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
