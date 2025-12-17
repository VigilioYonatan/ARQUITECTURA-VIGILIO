import { UsersRepository } from "@modules/users";
import type { User } from "@modules/users/entities/user.entity";
import { BadRequestException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { vi } from "vitest";
import { AuthService } from "../services/auth.service";

/**
 * AuthService Unit Tests - Senior Level
 *
 * Coverage Goals:
 * - All public methods tested
 * - Edge cases and error scenarios
 * - Security considerations
 * - Proper mocking and isolation
 */
describe("AuthService", () => {
    let service: AuthService;
    let usersRepository: {
        findByEmail: ReturnType<typeof vi.fn>;
        store: ReturnType<typeof vi.fn>;
        index: ReturnType<typeof vi.fn>;
    };

    // Test fixtures
    const mockUser: User = {
        id: 1,
        email: "test@example.com",
        password: "$2b$10$hashedpassword",
        user_name: "testuser",
        full_name: "Test User",
        father_lastname: "User",
        mother_lastname: "Test",
        role: "estudiante",
        status: "activo",
        photo: [],
        created_at: new Date(),
        updated_at: new Date(),
    } as User;

    beforeEach(async () => {
        // Create fresh mocks for each test
        usersRepository = {
            findByEmail: vi.fn(),
            store: vi.fn(),
            index: vi.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersRepository,
                    useValue: usersRepository,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    // =========================================================================
    // validateUser() Tests
    // =========================================================================
    describe("validateUser", () => {
        it("should return null when user does not exist", async () => {
            usersRepository.findByEmail.mockResolvedValue(null);

            const result = await service.validateUser(
                "nonexistent@test.com",
                "password"
            );

            expect(result).toBeNull();
            expect(usersRepository.findByEmail).toHaveBeenCalledWith(
                "nonexistent@test.com"
            );
        });

        it("should return null when password is incorrect", async () => {
            usersRepository.findByEmail.mockResolvedValue(mockUser);
            vi.spyOn(bcrypt, "compare").mockImplementation(async () => false);

            const result = await service.validateUser(
                "test@example.com",
                "wrongpassword"
            );

            expect(result).toBeNull();
        });

        it("should return user without password when credentials are valid", async () => {
            usersRepository.findByEmail.mockResolvedValue(mockUser);
            vi.spyOn(bcrypt, "compare").mockImplementation(async () => true);

            const result = await service.validateUser(
                "test@example.com",
                "correctpassword"
            );

            expect(result).not.toBeNull();
            expect(result?.password).toBeNull();
            expect(result?.email).toBe("test@example.com");
        });

        it("should return null when user has no password (OAuth user)", async () => {
            const oauthUser = { ...mockUser, password: null };
            usersRepository.findByEmail.mockResolvedValue(oauthUser);

            const result = await service.validateUser(
                "test@example.com",
                "anypassword"
            );

            expect(result).toBeNull();
        });
    });

    // =========================================================================
    // validateUserByEmail() Tests
    // =========================================================================
    describe("validateUserByEmail", () => {
        it("should return user without password when found", async () => {
            usersRepository.findByEmail.mockResolvedValue(mockUser);

            const result = await service.validateUserByEmail(
                "test@example.com"
            );

            expect(result).not.toBeNull();
            expect(result?.password).toBeNull();
        });

        it("should return null when user not found", async () => {
            usersRepository.findByEmail.mockResolvedValue(null);

            const result = await service.validateUserByEmail(
                "notfound@test.com"
            );

            expect(result).toBeNull();
        });
    });

    // =========================================================================
    // register() Tests
    // =========================================================================
    describe("register", () => {
        const registerDto = {
            email: "new@example.com",
            password: "SecurePass123!",
            user_name: "newuser",
            full_name: "New User",
            father_lastname: "User",
        };

        it("should throw BadRequestException when user already exists", async () => {
            usersRepository.findByEmail.mockResolvedValue(mockUser);

            await expect(service.register(registerDto)).rejects.toThrow(
                BadRequestException
            );
            await expect(service.register(registerDto)).rejects.toThrow(
                "User already exists"
            );
        });

        it("should hash password before storing", async () => {
            usersRepository.findByEmail.mockResolvedValue(null);
            usersRepository.store.mockResolvedValue({
                ...mockUser,
                email: registerDto.email,
            });
            const hashSpy = vi.spyOn(bcrypt, "hash");

            await service.register(registerDto);

            expect(hashSpy).toHaveBeenCalledWith(registerDto.password, 10);
        });

        it("should return user without password after registration", async () => {
            usersRepository.findByEmail.mockResolvedValue(null);
            usersRepository.store.mockResolvedValue({
                ...mockUser,
                email: registerDto.email,
            });
            vi.spyOn(bcrypt, "hash").mockImplementation(
                async () => "hashedpassword"
            );

            const result = await service.register(registerDto);

            expect(result.password).toBeNull();
            expect(result.email).toBe(registerDto.email);
        });

        it("should assign default role 'estudiante' to new users", async () => {
            usersRepository.findByEmail.mockResolvedValue(null);
            usersRepository.store.mockResolvedValue({
                ...mockUser,
                email: registerDto.email,
            });
            vi.spyOn(bcrypt, "hash").mockImplementation(
                async () => "hashedpassword"
            );

            await service.register(registerDto);

            expect(usersRepository.store).toHaveBeenCalledWith(
                expect.objectContaining({ role: "estudiante" })
            );
        });
    });

    // =========================================================================
    // validateGoogleUser() Tests
    // =========================================================================
    describe("validateGoogleUser", () => {
        const googleProfile = {
            id: "google123",
            emails: [{ value: "google@example.com" }],
            displayName: "Google User",
            name: { familyName: "User", givenName: "Google" },
            photos: [{ value: "https://photo.url" }],
        } as any;

        it("should throw BadRequestException when profile has no email", async () => {
            const profileNoEmail = { ...googleProfile, emails: [] };

            await expect(
                service.validateGoogleUser(profileNoEmail)
            ).rejects.toThrow(BadRequestException);
        });

        it("should return existing user if email already registered", async () => {
            usersRepository.findByEmail.mockResolvedValue(mockUser);

            const result = await service.validateGoogleUser(googleProfile);

            expect(usersRepository.store).not.toHaveBeenCalled();
            expect(result.password).toBeNull();
        });

        it("should auto-register new Google user", async () => {
            usersRepository.findByEmail.mockResolvedValue(null);
            usersRepository.store.mockResolvedValue({
                ...mockUser,
                email: "google@example.com",
            });

            const result = await service.validateGoogleUser(googleProfile);

            expect(usersRepository.store).toHaveBeenCalled();
            expect(result).toBeDefined();
        });
    });

    // =========================================================================
    // forgotPassword() Tests
    // =========================================================================
    describe("forgotPassword", () => {
        it("should throw BadRequestException when user not found", async () => {
            usersRepository.index.mockResolvedValue({ data: [] });

            await expect(
                service.forgotPassword("notfound@test.com")
            ).rejects.toThrow(BadRequestException);
        });

        it("should return token when user exists", async () => {
            usersRepository.index.mockResolvedValue({ data: [mockUser] });

            const result = await service.forgotPassword("test@example.com");

            expect(result).toHaveProperty("token");
            expect(result).toHaveProperty("message", "Recovery email sent");
        });
    });

    // =========================================================================
    // resetPassword() Tests
    // =========================================================================
    describe("resetPassword", () => {
        it("should hash new password", async () => {
            const hashSpy = vi.spyOn(bcrypt, "hash");

            await service.resetPassword("validtoken", "NewPassword123!");

            expect(hashSpy).toHaveBeenCalledWith("NewPassword123!", 10);
        });

        it("should return success message", async () => {
            vi.spyOn(bcrypt, "hash").mockImplementation(async () => "newhash");

            const result = await service.resetPassword(
                "validtoken",
                "NewPassword123!"
            );

            expect(result).toEqual({ message: "Password reset successfully" });
        });
    });
});
