import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { Header, render } from "../libs";
import { WebService } from "../services/web.service";

@Controller()
export class WebController {
    constructor(private readonly webService: WebService) {}

    @Get("/")
    async index(@Req() req: Request, @Res() res: Response) {
        const head = await Header({ title: "Hola mundo" });
        const props = this.webService.index();
        return await render({ head, props })(req, res);
    }

    @Get("/product/:slug")
    async product(
        @Req() req: Request,
        @Res() res: Response,
        @Param("slug") slug: string
    ) {
        const head = await Header({ title: "Hola mundo" });
        return await render({ head, props: { slug } })(req, res);
    }
}
