import { UserEntity } from "../entities/user.entity";

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export const userProviders = [
    {
        provide: USER_REPOSITORY,
        useValue: UserEntity,
    },
];
