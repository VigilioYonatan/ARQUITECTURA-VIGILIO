import { UserModule } from "@modules/users/modules/user.module"; // Import real user module or mock
import { type INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AuthModule } from "../auth.module";

// Use a simplified setup for E2E
describe("AuthController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                AuthModule,
                UserModule, // We need Users logic
                // Add Database module mocking or use real test DB?
                // For Senior level, usually we use a Docker Testcontainer or InMemory DB (sqlite)
                // Here assuming we mock the Repository at the module level or use the real one if env is set
            ],
        })
            .overrideProvider("DRIZZLE") // Mock DB connection if possible?
            .useValue({
                query: {
                    user: {
                        findMany: vi.fn().mockResolvedValue([]),
                        findFirst: vi.fn().mockResolvedValue(null),
                    },
                },
                insert: vi.fn().mockReturnThis(),
                values: vi.fn().mockReturnThis(),
                returning: vi
                    .fn()
                    .mockResolvedValue([{ id: 1, email: "e2e@test.com" }]),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it("/auth/register (POST) - Success", () => {
        return request(app.getHttpServer())
            .post("/auth/register")
            .send({
                user_name: "testuser",
                email: "e2e@test.com",
                password: "password123",
                full_name: "Test User",
                father_lastname: "Test",
            })
            .expect(201)
            .expect((res) => {
                expect(res.body.email).toEqual("e2e@test.com");
            });
    });

    it("/auth/register (POST) - Fail Validation", () => {
        return request(app.getHttpServer())
            .post("/auth/register")
            .send({
                email: "invalid-email",
            })
            .expect(400);
    });
});
