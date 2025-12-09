import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    UsePipes,
} from "@nestjs/common";
import { UsersService } from "../services/users.service";
import {
    CreateUserSchema,
    CreateUserDto,
    UpdateUserSchema,
    UpdateUserDto,
} from "../schemas/users.schema";
import {
    Cacheable,
    CacheEvict,
} from "../../../common/decorators/cache.decorator";
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from "@nestjs/swagger";
import { ValibotPipe } from "../../../common/pipes/valibot.pipe";

@ApiTags("users")
@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: "Create a new user" })
    @ApiResponse({
        status: 201,
        description: "The user has been successfully created.",
    })
    @ApiResponse({ status: 400, description: "Bad Request." })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                name: { type: "string", example: "John Doe" },
                email: { type: "string", example: "john@example.com" },
                password: { type: "string", example: "password123" },
                avatarUrl: {
                    type: "string",
                    example: "https://example.com/avatar.jpg",
                },
            },
            required: ["name", "email", "password"],
        },
    })
    @UsePipes(new ValibotPipe(CreateUserSchema))
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a user by ID" })
    @ApiResponse({ status: 200, description: "Return the user." })
    @ApiResponse({ status: 404, description: "User not found." })
    @Cacheable({ key: "users", ttl: 60 })
    findOne(@Param("id") id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(":id")
    @ApiOperation({ summary: "Update a user" })
    @ApiResponse({
        status: 200,
        description: "The user has been successfully updated.",
    })
    @ApiResponse({ status: 404, description: "User not found." })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                name: { type: "string", example: "John Doe" },
                email: { type: "string", example: "john@example.com" },
                password: { type: "string", example: "password123" },
                avatarUrl: {
                    type: "string",
                    example: "https://example.com/avatar.jpg",
                },
            },
        },
    })
    @UsePipes(new ValibotPipe(UpdateUserSchema))
    @CacheEvict({ key: "users" })
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
}
