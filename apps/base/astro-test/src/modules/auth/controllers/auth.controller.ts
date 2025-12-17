import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { type Request, type Response } from "express";
import type { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { AuthService } from "../services/auth.service";

@Controller("/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post("/login")
    async login(@Req() req: Request, @Body() _loginDto: LoginDto) {
        // Passport LocalStrategy validates user and attaches it to req.user
        // LocalAuthGuard triggers the strategy
        return req.user;
    }

    @Post("/register")
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Get("/google")
    @UseGuards(AuthGuard("google"))
    async googleAuth() {
        // Initiates Google OAuth flow
    }

    @Get("/google/callback")
    @UseGuards(AuthGuard("google"))
    async googleAuthRedirect(@Req() _req: Request, @Res() res: Response) {
        // Successful authentication, redirect home/dashboard
        res.redirect("/");
    }

    @Post("/logout")
    async logout(@Req() req: Request, @Res() res: Response) {
        req.logout((err) => {
            if (err) return res.status(500).send(err);
            res.clearCookie("connect.sid"); // Clean up session cookie
            return res.status(200).json({ message: "Logged out successfully" });
        });
    }

    @Get("/session")
    async session(@Req() req: Request) {
        if (!req.isAuthenticated()) {
            return {
                user: null,
            };
        }
        return {
            user: req.user,
        };
    }
}
