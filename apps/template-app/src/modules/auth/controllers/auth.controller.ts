import {
    Controller,
    Post,
    Get,
    Body,
    UsePipes,
    Res,
    Req,
    UseGuards,
} from "@nestjs/common";
import { Response, Request } from "express";
import { RefreshTokenGuard } from "../../../common/guards/refresh-token.guard";
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard";
import { GoogleAuthGuard } from "../../../common/guards/google-auth.guard";
import { AuthService } from "../services/auth.service";
import {
    LoginSchema,
    LoginDto,
    RegisterSchema,
    RegisterDto,
} from "../schemas/auth.schema";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { ValibotPipe } from "../../../common/pipes/valibot.pipe";
import { AUTH_CONSTANTS } from "../../../common/constants/auth.constants";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    @ApiOperation({ summary: "Register a new user" })
    @ApiResponse({ status: 201, description: "User successfully registered" })
    @ApiResponse({ status: 409, description: "Email already exists" })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                name: { type: "string", example: "John Doe" },
                email: { type: "string", example: "john@example.com" },
                password: { type: "string", example: "password123" },
            },
            required: ["name", "email", "password"],
        },
    })
    @UsePipes(new ValibotPipe(RegisterSchema))
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post("login")
    @ApiOperation({ summary: "Login user" })
    @ApiResponse({ status: 200, description: "Login successful, returns JWT" })
    @ApiResponse({ status: 401, description: "Invalid credentials" })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                email: { type: "string", example: "john@example.com" },
                password: { type: "string", example: "password123" },
            },
            required: ["email", "password"],
        },
    })
    @UsePipes(new ValibotPipe(LoginSchema))
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const tokens = await this.authService.login(loginDto);

        res.cookie(AUTH_CONSTANTS.COOKIE_NAME, tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: AUTH_CONSTANTS.COOKIE_PATH,
            maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_MS,
        });

        return { access_token: tokens.access_token };
    }

    @Post("refresh")
    @UseGuards(RefreshTokenGuard)
    @ApiOperation({ summary: "Refresh access token" })
    @ApiResponse({ status: 200, description: "New tokens issued" })
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const userId = req.user["sub"];
        const refreshToken = req.user["refreshToken"];

        const tokens = await this.authService.refresh(userId, refreshToken);

        res.cookie(AUTH_CONSTANTS.COOKIE_NAME, tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: AUTH_CONSTANTS.COOKIE_PATH,
            maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_MS,
        });

        return { access_token: tokens.access_token };
    }

    @Post("logout")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Logout user" })
    @ApiResponse({ status: 200, description: "Logged out successfully" })
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const userId = req.user["userId"];
        await this.authService.logout(userId);

        res.clearCookie(AUTH_CONSTANTS.COOKIE_NAME, {
            path: AUTH_CONSTANTS.COOKIE_PATH,
        });
        return { message: "Logged out successfully" };
    }

    @Get("google")
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: "Google Login" })
    googleLogin() {
        // Initiates the Google OAuth2 flow
    }

    @Get("google/callback")
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: "Google Login Callback" })
    async googleLoginCallback(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        // User is attached to req.user by GoogleStrategy
        const user = (req as any).user;

        const tokens = await this.authService.generateTokens(
            user.id,
            user.email
        );
        await this.authService.saveRefreshToken(user.id, tokens.refresh_token);

        (res as any).cookie(AUTH_CONSTANTS.COOKIE_NAME, tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: AUTH_CONSTANTS.COOKIE_PATH,
            maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_MS,
        });

        return { access_token: tokens.access_token };
    }
}
