import { RustFSService } from "@infrastructure/providers/storage/rustfs.service";
import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import type { Request } from "express";
import { type File, formidable } from "formidable";
import {
    type EntityFile,
    type EntityFileProperty,
    UPLOAD_CONFIG,
} from "../const/upload.const";
import type { FilesSchema } from "../schemas/upload.schema";

@Injectable()
export class UploadService {
    private readonly logger = new Logger(UploadService.name);
    constructor(private readonly rustFSService: RustFSService) {}

    async uploadFormidable(
        req: Request,
        entity: EntityFile,
        property: EntityFileProperty
    ): Promise<FilesSchema[]> {
        const entityConfig = UPLOAD_CONFIG[entity];
        this.logger.log({ entityConfig });
        if (!entityConfig) {
            throw new NotFoundException(
                `Entity '${entity}' not configured for uploads`
            );
        }
        const rule = entityConfig[property];
        if (!rule) {
            throw new NotFoundException(
                `Property '${property}' not configured for uploads`
            );
        }
        const form = formidable({
            keepExtensions: true,
            multiples: rule.max_files > 1,
            maxFileSize: rule.max_size,
            filter: ({ mimetype }) => {
                if (rule.mime_types.includes("*")) return true;
                return rule.mime_types.includes(mimetype!);
            },
        });
        type ParseResult = { filename?: string; files: File[] };
        const { files, filename } = await new Promise<ParseResult>(
            (resolve, reject) => {
                form.parse(req, async (err, fields, files) => {
                    if (err) {
                        if (err.code === 1009) {
                            return reject(
                                new BadRequestException(
                                    `File size exceeds limit of ${
                                        rule.max_size / 1024 / 1024
                                    }MB`
                                )
                            );
                        }
                        return reject(
                            new BadRequestException(
                                `Error parsing file: ${err.message}`
                            )
                        );
                    }

                    const fileInput = files.file;
                    this.logger.log(fileInput);
                    if (!fileInput) {
                        return reject(
                            new BadRequestException(
                                "No file uploaded or invalid type"
                            )
                        );
                    }

                    // Normalize to array
                    const filesArray = Array.isArray(fileInput)
                        ? fileInput
                        : [fileInput];

                    try {
                        resolve({
                            files: filesArray,
                            filename: Array.isArray(fields.filename)
                                ? fields.filename[0]
                                : fields.filename,
                        });
                    } catch (error) {
                        reject(error);
                    }
                });
            }
        );
        const result = await this.rustFSService.processAndUpload(
            files,
            rule,
            filename
        );

        return result;
    }
}
