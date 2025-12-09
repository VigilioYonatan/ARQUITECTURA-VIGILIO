import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@infrastructure/services/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    index() {
        const result = this.prisma.user.findMany();
        return result;
    }

    store(createUserDto: CreateUserDto) {
        const result = this.prisma.user.create({
            data: createUserDto,
        });
        return result;
    }

    show(id: number) {
        const result = this.prisma.user.findUnique({
            where: { id },
        });
        if (!result)
            throw new NotFoundException(`User with ID ${id} not found`);
        return result;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }

    destroy(id: number) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
