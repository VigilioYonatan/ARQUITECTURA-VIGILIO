import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { PrismaService } from "../../../providers/database/prisma.service";
import { RegisterDto, LoginDto } from "../schemas/auth.schema";
import { AUTH_CONSTANTS } from "../../../common/constants/auth.constants";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto) {
        const { email, password, name } = registerDto;

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new ConflictException("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        const { password: _, ...result } = user;
        return result;
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const tokens = await this.generateTokens(user.id, user.email);
        await this.saveRefreshToken(user.id, tokens.refresh_token);

        return tokens;
    }

    async generateTokens(userId: string, email: string) {
        const accessToken = this.jwtService.sign(
            { sub: userId, email },
            {
                // Casting to any to avoid strict type conflict with @types/jsonwebtoken
                expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY as any,
                secret: process.env.JWT_SECRET,
            }
        );

        // Refresh Token: Opaque string
        const refreshTokenId = crypto.randomUUID();
        const refreshTokenSecret = crypto.randomBytes(32).toString("hex");
        const refreshToken = `${refreshTokenId}.${refreshTokenSecret}`;

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            refresh_token_id: refreshTokenId,
            refresh_token_secret: refreshTokenSecret,
        };
    }

    async saveRefreshToken(userId: string, refreshToken: string) {
        const [id, secret] = refreshToken.split(".");
        const hash = await bcrypt.hash(secret, 10);

        await this.prisma.refreshToken.create({
            data: {
                id,
                token: hash,
                userId,
                expiresAt: new Date(
                    Date.now() + AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_MS
                ),
            },
        });
    }

    async refresh(userId: string, refreshToken: string) {
        const [id, secret] = refreshToken.split(".");
        if (!id || !secret)
            throw new UnauthorizedException("Invalid token format");

        const tokenRecord = await this.prisma.refreshToken.findUnique({
            where: { id },
        });

        if (!tokenRecord) throw new UnauthorizedException("Token not found");
        if (tokenRecord.revoked) {
            // Reuse detection: Revoke all user tokens?
            // For now, just throw.
            throw new UnauthorizedException("Token revoked");
        }

        const isValid = await bcrypt.compare(secret, tokenRecord.token);
        if (!isValid) throw new UnauthorizedException("Invalid token");

        if (new Date() > tokenRecord.expiresAt) {
            throw new UnauthorizedException("Token expired");
        }

        // Rotate: Revoke old, issue new
        await this.prisma.refreshToken.update({
            where: { id },
            data: { revoked: true },
        });

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new UnauthorizedException("User not found");

        const newTokens = await this.generateTokens(user.id, user.email);
        await this.saveRefreshToken(user.id, newTokens.refresh_token);

        return newTokens;
    }

    async logout(userId: string) {
        // Ideally we should revoke the specific token, but for now we just return true
        // as the controller clears the cookie.
        // In a real implementation, we would pass the refreshTokenId to revoke it.
        return true;
    }

    async validateGoogleUser(details: {
        email: string;
        name: string;
        avatarUrl: string;
        googleId: string;
    }) {
        const { email, name, avatarUrl, googleId } = details;

        // 1. Check if user exists by googleId
        let user = await this.prisma.user.findUnique({
            where: { googleId },
        });

        // 2. If not, check by email (link account)
        if (!user) {
            user = await this.prisma.user.findUnique({
                where: { email },
            });

            if (user) {
                // Link account
                user = await this.prisma.user.update({
                    where: { id: user.id },
                    data: { googleId, avatarUrl: user.avatarUrl || avatarUrl },
                });
            } else {
                // 3. Create new user
                user = await this.prisma.user.create({
                    data: {
                        email,
                        name,
                        avatarUrl,
                        googleId,
                        password: await bcrypt.hash(crypto.randomUUID(), 10), // Random password
                    },
                });
            }
        }

        return user;
    }
}
