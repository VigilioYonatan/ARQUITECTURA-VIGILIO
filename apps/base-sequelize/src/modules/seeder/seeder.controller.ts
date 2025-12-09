import { Controller, Get } from "@nestjs/common";
import type { SeederService } from "./seeder.service";

@Controller("/seeder")
export class SeederController {
    constructor(private readonly seederService: SeederService) {}

    @Get()
    async index() {
        return await this.seederService.index();
    }
}
