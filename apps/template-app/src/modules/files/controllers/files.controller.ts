import {
    Controller,
    Post,
    Req,
    BadRequestException,
    Query,
} from "@nestjs/common";
import { Request } from "express";
import * as formidable from "formidable";
import { FilesService } from "../services/files.service";
import { UPLOAD_RULES, UploadRole } from "../../../config/upload.config";

@Controller("files")
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post("upload")
    async uploadFile(
        @Req() req: Request,
        @Query("type") type: UploadRole = "default"
    ) {
        const rule = UPLOAD_RULES[type] || UPLOAD_RULES.default;

        const form = formidable({
            multiples: true, // Enable multiple files
            maxFileSize: rule.maxSize,
            filter: function ({ mimetype }) {
                if (rule.mimeTypes.includes("*")) return true;
                return rule.mimeTypes.includes(mimetype);
            },
        });

        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    if (err.code === 1009) {
                        return reject(
                            new BadRequestException(
                                `File size exceeds limit of ${
                                    rule.maxSize / 1024 / 1024
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
                if (!fileInput) {
                    return reject(
                        new BadRequestException(
                            "No file uploaded or invalid type"
                        )
                    );
                }

                // Normalize to array
                const uploadedFiles = Array.isArray(fileInput)
                    ? fileInput
                    : [fileInput];

                try {
                    const urls = await this.filesService.processAndUpload(
                        uploadedFiles,
                        rule
                    );
                    resolve({ urls });
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}
