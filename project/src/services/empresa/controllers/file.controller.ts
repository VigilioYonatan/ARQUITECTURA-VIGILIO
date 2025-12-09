import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Query,
    Req,
} from "@nestjs/common";
import { object, string } from "@vigilio/valibot";
import type { Request } from "express";
import { Pipe, Validator } from "@/infrastructure/libs/server/custom.decorator";
import type { FiltersPaginator } from "@/infrastructure/libs/server/helpers";
import { type FileStoreDto, fileStoreDto } from "../dtos/file.dto";
import { FileSchema } from "../schemas/file.schema";
import { FileService } from "../services/file.service";

@Controller("/file")
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Get("/")
    async index(@Query() filters: FiltersPaginator<FileSchema>) {
        const result = await this.fileService.index(filters);
        return result;
    }

    @Pipe(object({ id: string() }))
    @Get("/:id")
    async show(@Param("id") id: string) {
        const result = await this.fileService.show(id);
        return result;
    }

    @Validator(fileStoreDto)
    @HttpCode(201)
    @Post("/")
    async store(@Req() req: Request, @Body() body: FileStoreDto) {
        const result = await this.fileService.store(req.user, body);
        return result;
    }

    @Pipe(
        object({
            id: string(),
        })
    )
    @Delete("/:id")
    async destroy(@Param("id") id: string) {
        const result = await this.fileService.destroy(id);
        return result;
    }
}
