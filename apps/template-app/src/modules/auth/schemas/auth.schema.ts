import { object, string, email, minLength, Input } from "@vigilio/valibot";

export const LoginSchema = object({
    email: string([email()]),
    password: string([minLength(6)]),
});

export type LoginDto = Input<typeof LoginSchema>;

export const RegisterSchema = object({
    name: string([minLength(2)]),
    email: string([email()]),
    password: string([minLength(6)]),
});

export type RegisterDto = Input<typeof RegisterSchema>;
