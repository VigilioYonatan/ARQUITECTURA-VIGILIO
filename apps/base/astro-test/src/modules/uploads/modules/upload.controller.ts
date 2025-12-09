import { MinioService } from "@infrastructure/providers/storage/minio.service";
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
import type { EntityFile, EntityFileProperty } from "./upload.const";
import { UploadService } from "./upload.service";

@Controller("/upload")
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly minioService: MinioService
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

    // @Post("/chunk-start")
    // async startUpload(
    //     @Body() { fileName, fileSize }: { fileName: string; fileSize: number }
    // ) {
    //     return this.minioService.startMultipartUpload(fileName, fileSize);
    // }

    // @Post("/chunk-finish")
    // async finishUpload(
    //     @Body()
    //     {
    //         uploadId,
    //         key,
    //         parts,
    //     }: {
    //         uploadId: string;
    //         key: string;
    //         parts: { etag: string; part: number }[];
    //     }
    // ) {
    //     return await this.minioService.completeMultipartUpload(
    //         uploadId,
    //         key,
    //         parts
    //     );
    // }

    // @Delete("/chunk-abort/:upload_id")
    // async abortUpload(
    //     @Param("upload_id") upload_id: string,
    //     @Query("key") key: string
    // ) {
    //     await this.minioService.abortMultipartUpload(upload_id, key);
    //     return { ok: true };
    // }
    // --- SIMPLE ---
    @Post("/presigned-simple")
    async getPresignedUrl(@Body() body: { fileName: string }) {
        return this.minioService.getPresignedUrlSimple(body.fileName);
    }

    // --- MULTIPART ---

    @Post("/multipart-create")
    async createMultipart(@Body() body: { filename: string; type: string }) {
        return this.minioService.createMultipartUpload(
            body.filename,
            body.type
        );
    }

    @Post("/multipart-sign-part")
    async signPart(
        @Body() body: { key: string; uploadId: string; partNumber: number }
    ) {
        return this.minioService.signMultipartUploadPart(
            body.key,
            body.uploadId,
            body.partNumber
        );
    }

    @Post("/multipart-complete")
    async completeMultipart(
        @Body() body: { key: string; uploadId: string; parts: any[] }
    ) {
        return this.minioService.completeMultipartUpload(
            body.key,
            body.uploadId,
            body.parts
        );
    }

    @Delete(":key") // RUTA: DELETE /api/v1/upload/{key}
    async deleteFile(@Param("key") key: string) {
        if (!key) {
            // En NestJS con @Param, esto rara vez ocurre si la ruta está bien definida.
            throw new InternalServerErrorException("Missing file key.");
        }
        try {
            await this.minioService.removeFile(key);
            return { message: "File deleted successfully", key };
        } catch (error) {
            throw new InternalServerErrorException(
                "Error deleting file from storage."
            );
        }
    }
}
