import { ZodPipe } from "@infrastructure/pipes/zod.pipe";
import { Roles } from "@modules/auth/decorators/roles.decorator";
import { AuthenticatedGuard } from "@modules/auth/guards/authenticated.guard";
import { RolesGuard } from "@modules/auth/guards/roles.guard";
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    UsePipes,
} from "@nestjs/common";
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import {
    UserStoreDto,
    UserUpdateDto,
    userStoreSchema,
    userUpdateSchema,
} from "../dtos/user.dto";
import { UserService } from "../services/user.service";

@ApiTags("Users")
@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller("/user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: "Get all users" })
    @ApiResponse({
        status: 200,
        description: "List of users retrieved successfully.",
    })
    @Roles("super-admin", "administracion")
    @Get("/")
    index() {
        return this.userService.index();
    }

    @ApiOperation({ summary: "Create a new user" })
    @ApiBody({ type: UserStoreDto, description: "User creation data" })
    @ApiResponse({ status: 201, description: "User created successfully." })
    @ApiResponse({ status: 400, description: "Validation error." })
    @UsePipes(new ZodPipe(userStoreSchema))
    @Post("/")
    store(@Body() body: UserStoreDto) {
        return this.userService.store(body);
    }

    @ApiOperation({ summary: "Get a user by ID" })
    @ApiParam({ name: "id", description: "User ID", example: 1 })
    @ApiResponse({ status: 200, description: "User found." })
    @ApiResponse({ status: 404, description: "User not found." })
    @Get("/:id")
    show(@Param("id", ParseIntPipe) id: number) {
        return this.userService.show(id);
    }

    @ApiOperation({ summary: "Update a user by ID" })
    @ApiParam({ name: "id", description: "User ID", example: 1 })
    @ApiBody({ type: UserUpdateDto, description: "User update data" })
    @ApiResponse({ status: 200, description: "User updated successfully." })
    @UsePipes(new ZodPipe(userUpdateSchema))
    @Patch("/:id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() userUpdateDto: UserUpdateDto
    ) {
        return this.userService.update(id, userUpdateDto);
    }

    @ApiOperation({ summary: "Delete a user by ID" })
    @ApiParam({ name: "id", description: "User ID", example: 1 })
    @ApiResponse({ status: 200, description: "User deleted successfully." })
    @Delete("/:id")
    destroy(@Param("id", ParseIntPipe) id: number) {
        return this.userService.destroy(id);
    }
}
