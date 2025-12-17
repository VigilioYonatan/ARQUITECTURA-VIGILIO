import { z } from "@infrastructure/config/zod-i18n.config";
import { userSchema } from "@modules/users/schemas/user.schema";
import { createZodDto } from "nestjs-zod";

export const resetPasswordSchema = z
    .object({
        token: z.string(),
    })
    .extend({
        password: userSchema.shape.password.unwrap(),
    });

export class ResetPasswordDto extends createZodDto(resetPasswordSchema) {}
