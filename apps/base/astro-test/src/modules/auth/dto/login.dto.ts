import { userSchema } from "@modules/users/schemas/user.schema";
import { createZodDto } from "nestjs-zod";

export const loginSchema = userSchema
    .pick({
        email: true,
    })
    .extend({
        password: userSchema.shape.password.unwrap(),
    });

export class LoginDto extends createZodDto(loginSchema) {}
