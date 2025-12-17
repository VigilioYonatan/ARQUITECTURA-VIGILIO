import { RustFSService } from "@infrastructure/providers/storage/rustfs.service";
import {
    Body,
    Controller,
    Delete,
    InternalServerErrorException,
    Param,
    Post,
    Req,
} from "@nestjs/common";
import type { Request } from "express";
import type { EntityFile, EntityFileProperty } from "../const/upload.const";
import { UploadService } from "../services/upload.service";

@Controller("/upload")
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly rustFSService: RustFSService
    ) {}

    @Post("/:entity/:property")
    async upload(
        @Req() req: Request,
        @Param("entity") entity: EntityFile,
        @Param("property") property: EntityFileProperty
    ) {
        const result = await this.uploadService.uploadFormidable(
            req,
            entity,
            property
        );
        return result;
    }

    // --- SIMPLE ---
    @Post("/presigned-simple")
    async getPresignedUrl(@Body() body: { fileName: string }) {
        return this.rustFSService.getPresignedUrlSimple(body.fileName);
    }

    // --- MULTIPART ---

    @Post("/multipart-create")
    async createMultipart(@Body() body: { filename: string; type: string }) {
        return this.rustFSService.createMultipartUpload(
            body.filename,
            body.type
        );
    }

    @Post("/multipart-sign-part")
    async signPart(
        @Body() body: { key: string; uploadId: string; partNumber: number }
    ) {
        return this.rustFSService.signMultipartUploadPart(
            body.key,
            body.uploadId,
            body.partNumber
        );
    }

    @Post("/multipart-complete")
    async completeMultipart(
        @Body() body: { key: string; uploadId: string; parts: any[] }
    ) {
        return this.rustFSService.completeMultipartUpload(
            body.key,
            body.uploadId,
            body.parts
        );
    }

    @Delete("/:key") // RUTA: DELETE /api/v1/upload/{key}
    async deleteFile(@Param("key") key: string) {
        if (!key) {
            // En NestJS con @Param, esto rara vez ocurre si la ruta está bien definida.
            throw new InternalServerErrorException("Missing file key.");
        }
        try {
            await this.rustFSService.removeFile(key);
            return { message: "File deleted successfully", key };
        } catch (error) {
            throw new InternalServerErrorException(
                `Error deleting file from storage. ${(error as Error).message}`
            );
        }
    }
}
