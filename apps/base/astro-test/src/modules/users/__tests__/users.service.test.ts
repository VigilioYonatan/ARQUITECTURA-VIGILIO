import { Test, type TestingModule } from "@nestjs/testing";
import { vi } from "vitest";
import { UserCacheService } from "../cache/user.cache";
import { UserService } from "../services/user.service";

describe("UserService", () => {
    let service: UserService;
    let cacheService: UserCacheService;

    const mockUserCacheService = {
        index: vi.fn(),
        store: vi.fn(),
        show: vi.fn(),
        update: vi.fn(),
        destroy: vi.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: UserCacheService,
                    useValue: mockUserCacheService,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        cacheService = module.get<UserCacheService>(UserCacheService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("index", () => {
        it("should return an array of users", async () => {
            const result = { data: [] };
            mockUserCacheService.index.mockResolvedValue(result);

            expect(await service.index()).toEqual(result);
            expect(cacheService.index).toHaveBeenCalled();
        });
    });

    describe("show", () => {
        it("should return a single user", async () => {
            const result = { id: 1, name: "Test User" };
            mockUserCacheService.show.mockResolvedValue(result);

            expect(await service.show(1)).toEqual(result);
            expect(cacheService.show).toHaveBeenCalledWith(1);
        });
    });

    // Add more tests as needed
});
