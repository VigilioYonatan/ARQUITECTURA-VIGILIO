import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class SeederService {
    constructor(private readonly sequelize: Sequelize,) {}

    async index() {
        await this.sequelize.sync({ force: true });
        return "Hello World!";
    }
}
