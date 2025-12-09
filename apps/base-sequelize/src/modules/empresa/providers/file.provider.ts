import { FileEntity } from "../entities/file.entity";

export const FILE_REPOSITORY = Symbol("FILE_REPOSITORY");

export const fileProviders = [
    {
        provide: FILE_REPOSITORY,
        useValue: FileEntity,
    },
];
