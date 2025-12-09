import { Controller, Get } from "@nestjs/common";
import { UbigeoService } from "../services/ubigeo.service";

@Controller("/ubigeo")
export class UbigeoController {
	constructor(private readonly ubigeoService: UbigeoService) {}

	@Get("/")
	async index() {
		const result = await this.ubigeoService.index();
		return result;
	}
}
