import { Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../../providers/database/prisma.service";
import { CreateUserDto, UpdateUserDto } from "../schemas/users.schema";
import { StorageService } from "../../../providers/storage/storage.service";

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private storageService: StorageService
    ) {}

    async create(createUserDto: CreateUserDto) {
        if (
            createUserDto.avatarUrl &&
            createUserDto.avatarUrl.includes("/temp/")
        ) {
            createUserDto.avatarUrl = await this.promoteFile(
                createUserDto.avatarUrl
            );
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        return this.prisma.user.create({
            data: {
                name: createUserDto.name,
                email: createUserDto.email,
                password: hashedPassword,
                avatarUrl: createUserDto.avatarUrl || null,
            },
        });
    }

    async findOne(id: string) {
        const user = this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        if (
            updateUserDto.avatarUrl &&
            updateUserDto.avatarUrl.includes("/temp/")
        ) {
            updateUserDto.avatarUrl = await this.promoteFile(
                updateUserDto.avatarUrl
            );
        }

        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }

    private async promoteFile(tempUrl: string): Promise<string> {
        // Extract filename from URL
        // URL format: http://localhost:9000/bucket/temp/filename.jpg
        const parts = tempUrl.split("/temp/");
        if (parts.length < 2) return tempUrl;

        const filename = parts[1];
        const source = `temp/${filename}`;
        const dest = `users/${filename}`;

        const result = await this.storageService.moveFile(source, dest);
        return result.url;
    }
}
