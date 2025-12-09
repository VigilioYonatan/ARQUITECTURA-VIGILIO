import { describe, it, expect, beforeEach, vi } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "../../../providers/database/prisma.service";
import { StorageService } from "../../../providers/storage/storage.service";

describe("UsersService", () => {
    let service: UsersService;

    const mockPrismaService = {
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
    };

    const mockStorageService = {
        uploadFile: vi.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: StorageService,
                    useValue: mockStorageService,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
