import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("/api/users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Get()
    index() {
        return this.usersService.index();
    }

    @Post()
    store(@Body() createUserDto: CreateUserDto) {
        return this.usersService.store(createUserDto);
    }

    @Get(":id")
    show(@Param("id", ParseIntPipe) id: number) {
        return this.usersService.show(id);
    }

    @Patch(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(":id")
    destroy(@Param("id", ParseIntPipe) id: number) {
        return this.usersService.destroy(id);
    }
}
