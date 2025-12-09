import { MinioService } from "@infrastructure/providers/storage/minio.service";
import {
    Body,
    Controller,
    Delete,
    Param,
    Post,
    Query,
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
        console.log({ entity, property });

        const result = await this.uploadService.uploadFormidable(
            req,
            entity,
            property
        );
        return result;
    }

    @Post("/chunk-start")
    async startUpload(
        @Body() { fileName, fileSize }: { fileName: string; fileSize: number }
    ) {
        return this.minioService.startMultipartUpload(fileName, fileSize);
    }

    @Post("/chunk-finish")
    async finishUpload(
        @Body()
        {
            uploadId,
            key,
            parts,
        }: {
            uploadId: string;
            key: string;
            parts: { etag: string; part: number }[];
        }
    ) {
        return await this.minioService.completeMultipartUpload(
            uploadId,
            key,
            parts
        );
    }

    @Delete("/chunk-abort/:upload_id")
    async abortUpload(
        @Param("upload_id") upload_id: string,
        @Query("key") key: string
    ) {
        await this.minioService.abortMultipartUpload(upload_id, key);
        return { ok: true };
    }
}
