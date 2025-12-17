import { UsersRepository } from "@modules/users/repositories/users.repository";
import type { UserAuth } from "@modules/users/schemas/user.schema";
import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import type { Profile } from "passport-google-oauth20";
import { RegisterDto } from "../dto/register.dto";

@Injectable()
export class AuthService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async validateUser(email: string, pass: string): Promise<UserAuth | null> {
        const user = await this.usersRepository.findByEmail(email);
        if (user?.password) {
            const isMatch = await bcrypt.compare(pass, user.password);
            if (isMatch) {
                // Return user with password null (safe) to match UserAuth type
                return { ...user, password: null };
            }
            return null;
        }
        return null;
    }

    async validateUserByEmail(email: string): Promise<UserAuth | null> {
        const user = await this.usersRepository.findByEmail(email);
        return user ? { ...user, password: null } : null;
    }

    async register(registerDto: RegisterDto) {
        // Check if user exists
        const existingUser = await this.usersRepository.findByEmail(
            registerDto.email
        );

        if (existingUser) {
            throw new BadRequestException("User already exists");
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Map DTO to Repo expectations
        const newUser = await this.usersRepository.store({
            ...registerDto,
            password: hashedPassword,
            role: "estudiante", // Default role
            status: "activo",
            photo: [],
        } as any);

        return { ...newUser, password: null };
    }

    async validateGoogleUser(profile: Profile) {
        if (!profile.emails || !profile.emails[0]) {
            throw new BadRequestException("Google account must have an email");
        }

        const email = profile.emails[0].value;
        const user = await this.usersRepository.findByEmail(email);

        if (user) return { ...user, password: null };

        // Auto-register google user
        const newUser = await this.usersRepository.store({
            email: email,
            full_name: profile.displayName,
            father_lastname: profile.name?.familyName || "",
            mother_lastname: "",
            user_name: email.split("@")[0],
            password: "", // No password for OAuth
            google_id: profile.id, // Ensure schema supports this or we skip
            role: "estudiante",
            status: "activo",
            photo: profile.photos ? [{ file: profile.photos[0].value }] : [],
            is_register_automatic: true,
        } as any);

        return newUser;
    }

    async forgotPassword(email: string) {
        const { data: users } = await this.usersRepository.index();
        const user = users.find((u) => u.email === email);
        if (!user) {
            throw new BadRequestException("User not found");
        }

        const token = Math.random().toString(36).substring(7);
        // TODO: Store token in Redis
        // TODO: Send Email

        return { message: "Recovery email sent", token }; // Return token for now for testing
    }

    async resetPassword(_token: string, newPassword: string) {
        // TODO: Validate token
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // TODO: Update user password
        return { message: "Password reset successfully" };
    }
}
