import { userSchema } from "@modules/users/schemas/user.schema";
import { createZodDto } from "nestjs-zod";

export const forgotPasswordSchema = userSchema.pick({
    email: true,
});

export class ForgotPasswordDto extends createZodDto(forgotPasswordSchema) {}
