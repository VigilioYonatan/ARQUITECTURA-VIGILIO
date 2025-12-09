import { Controller, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { UploadService } from "../services/upload.service";

@Controller("upload")
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post()
    async upload(@Req() req: Request) {
        console.log(req);
        const result = await this.uploadService.uploadFormidable(req);
        return result;
    }
    // @Post("/chunk-start")
    // async startUpload(
    //     @Body() { fileName, fileSize }: { fileName: string; fileSize: number }
    // ) {
    //     return this.uploadService.startMultipartUpload(fileName, fileSize);
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
    //         parts: any[];
    //     }
    // ) {
    //     return await this.minio.completeMultipartUpload(uploadId, key, parts);
    // }

    // @Delete("/chunk-abort/:upload_id")
    // async abortUpload(
    //     @Param("upload_id") upload_id: string,
    //     @Query("key") key: string
    // ) {
    //     await this.minio.abortMultipartUpload(upload_id, key);
    //     return { ok: true };
    // }
}
