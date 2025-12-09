import { ValibotPipe } from "@infrastructure/pipes/valibot.pipe";
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UsePipes,
} from "@nestjs/common";
import type { Request } from "express";
import {
    type UserStoreDto,
    type UserUpdateDto,
    userStoreDto,
} from "../dto/user.dto";
import { UserService } from "../services/user.service";

@Controller("/user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("/")
    index() {
        return this.userService.index();
    }

    @UsePipes(new ValibotPipe(userStoreDto))
    @Post("/")
    store(@Req() req: Request, @Body() body: UserStoreDto) {
        return this.userService.store(req.locals.user, body);
    }

    @Get("/:id")
    show(@Param("id", ParseIntPipe) id: number) {
        return this.userService.show(id);
    }

    @Patch("/:id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() userUpdateDto: UserUpdateDto
    ) {
        return this.userService.update(id, userUpdateDto);
    }

    @Delete("/:id")
    destroy(@Param("id", ParseIntPipe) id: number) {
        return this.userService.destroy(id);
    }
}
