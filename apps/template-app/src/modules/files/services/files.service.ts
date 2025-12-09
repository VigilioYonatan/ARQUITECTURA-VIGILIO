import { Injectable, BadRequestException } from "@nestjs/common";
import * as fs from "fs";
import * as sharp from "sharp";
import { StorageService } from "../../../providers/storage/storage.service";
import { UploadRule } from "../../../config/upload.config";

import * as ffmpeg from "fluent-ffmpeg";
import * as ffmpegPath from "ffmpeg-static";

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath as unknown as string);

@Injectable()
export class FilesService {
    constructor(private readonly storageService: StorageService) {}

    async processAndUpload(files: any[], rule: UploadRule): Promise<string[]> {
        // Max Files Validation
        const maxFiles = rule.maxFiles || 5;
        if (files.length > maxFiles) {
            throw new BadRequestException(
                `Max files limit exceeded. Allowed: ${maxFiles}, Received: ${files.length}`
            );
        }

        const urls: string[] = [];

        for (const uploadedFile of files) {
            let fileToUpload: Buffer | fs.ReadStream;
            let filename = uploadedFile.originalFilename;
            let mimetype = uploadedFile.mimetype || "application/octet-stream";
            let size = uploadedFile.size;

            // Image Optimization (Sharp) - Keep Buffer for images (usually small < 10MB)
            if (mimetype.startsWith("image/")) {
                try {
                    let buffer = fs.readFileSync(uploadedFile.filepath);
                    let pipeline = sharp(buffer);

                    if (rule.resize) {
                        pipeline = pipeline.resize(rule.resize);
                    } else {
                        pipeline = pipeline.resize({
                            width: 1024,
                            withoutEnlargement: true,
                        });
                    }

                    const optimizedBuffer = await pipeline
                        .webp({ quality: 80 })
                        .toBuffer();

                    fileToUpload = optimizedBuffer;
                    filename = `${filename.split(".")[0]}.webp`;
                    mimetype = "image/webp";
                    size = optimizedBuffer.length;
                } catch (sharpError) {
                    console.warn(
                        "Image optimization failed, uploading original:",
                        sharpError
                    );
                    fileToUpload = fs.createReadStream(uploadedFile.filepath);
                }
            }
            // Video Optimization (FFmpeg)
            else if (mimetype.startsWith("video/")) {
                try {
                    const outputFilename = `${
                        filename.split(".")[0]
                    }_optimized.mp4`;
                    const outputPath = `temp/${outputFilename}`;

                    await new Promise((resolve, reject) => {
                        ffmpeg(uploadedFile.filepath)
                            .videoCodec("libx264")
                            .addOption("-preset", "slow")
                            .addOption("-crf", "26")
                            .videoFilters(["scale='min(1280,iw)':-2"])
                            .audioCodec("aac")
                            .audioBitrate("128k")
                            .audioChannels(2)
                            .audioFilters("loudnorm")
                            .addOption("-movflags", "+faststart")
                            .on("end", () => {
                                console.log("✅ Video Premium Terminado");
                                resolve(true);
                            })
                            .on("error", (err) => {
                                console.error("❌ Error:", err);
                                reject(err);
                            })
                            .save(outputPath);
                    });

                    fileToUpload = fs.createReadStream(outputPath);
                    filename = outputFilename;
                    mimetype = "video/mp4";
                    // Size is unknown for stream, MinIO handles it
                    size = undefined;

                    // Note: We need to handle cleanup of this temp file after upload
                } catch (ffmpegError) {
                    console.warn(
                        "Video optimization failed, uploading original:",
                        ffmpegError
                    );
                    fileToUpload = fs.createReadStream(uploadedFile.filepath);
                }
            } else {
                // Default: Stream directly from temp file
                fileToUpload = fs.createReadStream(uploadedFile.filepath);
            }

            const result = await this.storageService.uploadFile(
                `temp/${filename}`,
                fileToUpload,
                mimetype,
                size
            );

            // Clean up temp files
            try {
                if (fs.existsSync(uploadedFile.filepath)) {
                    fs.unlinkSync(uploadedFile.filepath);
                }
                // If we created an optimized video, clean it up too
                if (
                    mimetype === "video/mp4" &&
                    filename.includes("_optimized")
                ) {
                    const optimizedPath = `temp/${filename}`;
                    if (fs.existsSync(optimizedPath)) {
                        fs.unlinkSync(optimizedPath);
                    }
                }
            } catch (err) {
                console.warn(
                    `Failed to delete temp file: ${uploadedFile.filepath}`,
                    err
                );
            }

            urls.push(result.url);
        }

        return urls;
    }
}
