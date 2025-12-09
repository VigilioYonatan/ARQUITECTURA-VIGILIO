import { User } from "../entities/user.entity";

export const USER_REPOSITORY = "USER_REPOSITORY";
export const usersProviders = [
    {
        provide: USER_REPOSITORY,
        useValue: User,
    },
];
