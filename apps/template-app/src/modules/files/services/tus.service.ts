import { Injectable, OnModuleInit } from "@nestjs/common";
import { Server, EVENTS } from "@tus/server";
import { FileStore } from "@tus/file-store";
import * as fs from "fs";
import * as path from "path";
import { FilesService } from "./files.service";
import { UPLOAD_RULES } from "../../../config/upload.config";

@Injectable()
export class TusService implements OnModuleInit {
    private readonly tusServer: Server;

    constructor(private readonly filesService: FilesService) {
        const uploadDir = path.join(process.cwd(), "uploads", "temp");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        this.tusServer = new Server({
            path: "/files/resumable",
            datastore: new FileStore({
                directory: uploadDir,
            }),
        });
    }

    onModuleInit() {
        this.tusServer.on(EVENTS.POST_FINISH, async (req, res, upload) => {
            console.log(`Upload complete for file ${upload.id}`);

            try {
                const uploadDir = path.join(process.cwd(), "uploads", "temp");
                const filePath = path.join(uploadDir, upload.id);

                // Mock a file object similar to what formidable provides
                const file = {
                    filepath: filePath,
                    originalFilename: upload.metadata?.filename || upload.id,
                    mimetype:
                        upload.metadata?.filetype || "application/octet-stream",
                    size: upload.size,
                };

                // Determine type from metadata or default
                const type =
                    (upload.metadata
                        ?.type as import("../../../config/upload.config").UploadRole) ||
                    "default";
                const rule = UPLOAD_RULES[type] || UPLOAD_RULES.default;

                await this.filesService.processAndUpload([file], rule);

                // Cleanup handled by FilesService processAndUpload
            } catch (error) {
                console.error("Error processing Tus upload:", error);
            }
        });
    }

    get server() {
        return this.tusServer;
    }
}
