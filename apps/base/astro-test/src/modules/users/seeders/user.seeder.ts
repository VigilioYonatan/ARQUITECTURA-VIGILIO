import { faker } from "@faker-js/faker";
import { slugify } from "@infrastructure/libs";
import { DRIZZLE } from "@infrastructure/providers/database/database.module";
import { schema } from "@infrastructure/providers/database/database.schema";
import { userEntity } from "@modules/users/entities/user.entity";
import { Inject, Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { UserSchema } from "../schemas";

@Injectable()
export class UserSeeder {
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>
    ) {}

    async run() {
        // Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("Dokixd123@", salt);

        const usersSeed: Omit<UserSchema, "id">[] = await Promise.all(
            Array.from({ length: 100 }).map(
                async (_, i): Promise<Omit<UserSchema, "id">> => {
                    const user_name = `${faker.person.firstName()}${faker.person.lastName()}-${
                        i + 1
                    }`;
                    return {
                        code: `USER-${i + 1}`,
                        documento: "12345678",
                        documento_code: "01",
                        user_name: user_name,
                        full_name: faker.person.fullName(),
                        father_lastname: faker.person.lastName(),
                        mother_lastname: faker.person.lastName(),
                        email: faker.internet.email(),
                        password: hashedPassword,
                        role: "estudiante",
                        profesion: faker.person.jobTitle(),
                        status: faker.helpers.arrayElement<
                            UserSchema["status"]
                        >([
                            "activo",
                            "desactivado",
                            "bloqueo-temporal",
                            "bloqueo-definitivo",
                        ]),
                        telefono: `9${i.toString().padStart(8, "0")}`,
                        is_register_automatic: false,
                        intentos_session: 0,
                        enabled_notifications_webpush: true,
                        address: "Direccion demo",
                        slug: slugify(user_name),
                        gender: faker.helpers.arrayElement([
                            "masculino",
                            "femenino",
                        ]),
                        estudiante_status: faker.helpers.arrayElement<
                            UserSchema["estudiante_status"]
                        >([
                            "activo",
                            "retirado",
                            "suspendido",
                            "expulsado",
                            "egresado",
                        ]),
                        intentos_session_date: faker.date.past(),
                        ultima_conexion: faker.date.past(),
                        photo: null,
                        wallpaper: null,
                        presentation: null,
                        created_at: null,
                        updated_at: null,
                        deleted_at: null,
                        subscription: null,
                    };
                }
            )
        );
        return await this.db.insert(userEntity).values(usersSeed).returning();
    }
}
