import type { PaginatorResult } from "@infrastructure/libs/server/helpers";
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Req,
} from "@nestjs/common";
import type { Request } from "express";
import { type FileStoreDto } from "../dtos/file.dto";
import type { FileSchema } from "../schemas/file.schema";
import type { FileService } from "../services/file.service";

@Controller("/file")
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Get("/")
    async index(@Query() filters: PaginatorResult<FileSchema>) {
        const result = await this.fileService.index(filters);
        return result;
    }

    @Get("/:id")
    async show(@Param("id", ParseIntPipe) id: number) {
        const result = await this.fileService.show(id);
        return result;
    }

    @HttpCode(201)
    @Post("/")
    async store(@Req() req: Request, @Body() body: FileStoreDto) {
        const result = await this.fileService.store(req.locals.user, body);
        return result;
    }

    @Delete("/:id")
    async destroy(@Param("id", ParseIntPipe) id: number) {
        const result = await this.fileService.destroy(id);
        return result;
    }
}
