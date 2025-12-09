import {
    object,
    string,
    email,
    minLength,
    url,
    nullable,
    partial,
    Input,
} from "@vigilio/valibot";

export const CreateUserSchema = object({
    name: string([minLength(1)]),
    email: string([email()]),
    password: string([minLength(6)]),
    avatarUrl: nullable(string([url()])),
});

export type CreateUserDto = Input<typeof CreateUserSchema>;

export const UpdateUserSchema = partial(CreateUserSchema);

export type UpdateUserDto = Input<typeof UpdateUserSchema>;
