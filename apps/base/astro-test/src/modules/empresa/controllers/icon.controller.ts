import type { FiltersPaginator } from "@infrastructure/libs/server/helpers";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	Req,
} from "@nestjs/common";
import type { Request } from "express";
import { type IconStoreDto, type IconUpdateDto } from "../dtos/icon.dto";
import type { IconSchema } from "../schemas/icon.schema";
import { IconService } from "../services/icon.service";

@Controller("/icon")
export class IconController {
	constructor(private readonly iconService: IconService) {}

	@Get("/")
	async index(@Query() query: FiltersPaginator<IconSchema>) {
		const result = await this.iconService.index(query);
		return result;
	}

	@Get("/:id")
	async show(@Param("id", ParseIntPipe) id: number) {
		const result = await this.iconService.show(id);
		return result;
	}

	@HttpCode(201)
	@Post("/")
	async store(@Req() req: Request, @Body() body: IconStoreDto) {
		const result = await this.iconService.store(req.locals.user, body);
		return result;
	}

	@Put("/:id")
	async update(
		@Req() req: Request,
		@Param("id", ParseIntPipe) id: number,
		@Body() body: IconUpdateDto,
	) {
		const result = await this.iconService.update(req.locals.user, id, body);
		return result;
	}

	@Delete("/:id")
	async destroy(@Param("id", ParseIntPipe) id: number) {
		const result = await this.iconService.destroy(id);
		return result;
	}
}
