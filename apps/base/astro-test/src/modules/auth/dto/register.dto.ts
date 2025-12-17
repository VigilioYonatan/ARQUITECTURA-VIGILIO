import { userSchema } from "@modules/users/schemas/user.schema";
import { createZodDto } from "nestjs-zod";

export const registerSchema = userSchema
    .pick({
        email: true,
        full_name: true,
        father_lastname: true,
        mother_lastname: true,
        user_name: true,
        telefono: true,
    })
    .extend({
        password: userSchema.shape.password.unwrap(),
    });

export class RegisterDto extends createZodDto(registerSchema) {}
