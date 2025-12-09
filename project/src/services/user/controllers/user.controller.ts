// import { Body, Controller, HttpCode, Param, Query } from "@nestjs/common";
// import { UserService } from "../services/user.service";
// import { Get, Post, Req } from "@vigilio/express-core";
// import type { RequestVigilio } from "~/config/server/const";
// import type { FiltersPaginator } from "~/libs/server/helpers";
// import type { UserAuth, UserSchema } from "../schemas/user.schema";
// import { UserStoreDto } from "../dtos/user.dto";

// @Controller()
// export class UserController {
//     constructor(private readonly userService: UserService) {}

//     // @JWTAuth()
//     @Get("/")
//     async index(
//         @Req() req: RequestVigilio,
//         @Query()
//         query: FiltersPaginator<UserSchema>
//     ) {
//         const result = await this.userService.index(req.user, query);
//         return result;
//     }

//     // @JWTAuth(["super-admin", "academico"])
//     @HttpCode(201)
//     // @Validator(userStoreDto)
//     @Post("/")
//     async store(@Req("user") user: UserAuth, @Body() body: UserStoreDto) {
//         const result = await this.userService.store(user, body);
//         return result;
//     }

//     // @OnlyBussiness()
//     // @JWTAuth(["super-admin", "academico"])
//     @Get("/:id")
//     async show(@Param("id") id: string) {
//         const result = await this.userService.show(id);
//         return result;
//     }

//     @OnlyBussiness()
//     @JWTAuth(["super-admin", "academico"])
//     @Pipe(object({ id: string() }))
//     @Get("/:id/cursos")
//     async showCursos(@Params("id") id: string) {
//         // const result = await this.userService.showCursos(id);
//         // return result;
//     }

//     @OnlyBussiness()
//     @JWTAuth(["super-admin", "academico"])
//     @Status(201)
//     @Pipe(object({ id: string() }))
//     @Validator(userUpdateDto)
//     @Put("/:id")
//     async update(
//         @Req("user") user: UserAuth,
//         @Params("id") id: string,
//         @Body() body: UserUpdateDto
//     ) {
//         const result = await this.userService.update(user, id, body);
//         return result;
//     }

//     @OnlyBussiness()
//     @JWTAuth(["super-admin", "academico"])
//     @Pipe(object({ id: string() }))
//     @Validator(userUpdatePasswordDto)
//     @Put("/:id/update-password")
//     async updatePassword(
//         @Params("id") id: string,
//         @Body() body: UserUpdatePasswordDto
//     ) {
//         const result = await this.userService.updatePassword(id, body);
//         return result;
//     }

//     @JWTAuth(["super-admin", "academico"])
//     @Pipe(object({ id: string() }))
//     @Delete("/:id")
//     async destroy(@Params("id") id: string) {
//         const result = await this.userService.destroy(id);
//         return result;
//     }

//     @OnlyBussiness()
//     @Validator(object({ ids: array(number()) }))
//     @JWTAuth(["super-admin", "academico"])
//     @Delete("/")
//     async destroyUsers(@Body() body: { ids: number[] }) {
//         const result = await this.userService.destroyUsers(body.ids);
//         return result;
//     }
// }
