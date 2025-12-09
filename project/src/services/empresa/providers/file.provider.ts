import { FileEntity } from "../entities/file.entity";

export const FILE_REPOSITORY = "FILE_REPOSITORY";
export const filesProviders = [
    {
        provide: FILE_REPOSITORY,
        useValue: FileEntity,
    },
];
