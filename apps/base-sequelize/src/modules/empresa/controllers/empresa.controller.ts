import { Controller, Injectable, Put, Req } from "@nestjs/common";
import type { Request } from "express";
import { EmpresaService } from "../services/empresa.service";

@Injectable()
@Controller("/empresa")
export class EmpresaController {
    constructor(private readonly empresaService: EmpresaService) {}

    @Put("/")
    async update(@Req() req: Request) {
        const result = await this.empresaService.update(
            req.locals.user,
            req.locals.empresa,
            req.body
        );
        return result;
    }
}
