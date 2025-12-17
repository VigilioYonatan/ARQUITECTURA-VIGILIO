import { UbigeoSeeder } from "@modules/ubigeo/seeder/ubigeo.seeder";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../database.module";
import type { schema } from "../database.schema";

@Injectable()
export class SeederService {
	private readonly logger = new Logger(SeederService.name);

	constructor(
		@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
		private readonly ubigeoSeeder: UbigeoSeeder,
	) {}

	async run() {
		this.logger.log("🌱 Iniciando Seeding...");

		await this.resetDatabase();
		await this.ubigeoSeeder.run();

		this.logger.log("✅ Seeding completado exitosamente.");
	}

	private async resetDatabase() {
		this.logger.warn("🗑️  Limpiando tablas...");

		// 1. Obtener todas las tablas del esquema 'public'
		// Usamos sql.raw para asegurar que no intente parametrizar nada raro
		const query = sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
		const result = await this.db.execute(query);

		// El resultado en node-postgres viene en .rows
		const tables = result.rows.map((row) => row.tablename);

		// 2. Filtrar tablas que NO debemos borrar
		// Es vital no borrar la tabla de migraciones de Drizzle para no romper el historial
		const tablesToDelete = tables.filter(
			(tableName) =>
				tableName !== "__drizzle_migrations" && tableName !== "migrations", // Por si acaso
		);

		if (tablesToDelete.length === 0) {
			this.logger.warn("⚠️  No se encontraron tablas para limpiar.");
			return;
		}

		// 3. Construir una sola sentencia TRUNCATE masiva
		// Resultado: TRUNCATE TABLE "users", "cities", "regions" RESTART IDENTITY CASCADE;
		const truncateQuery = `TRUNCATE TABLE ${tablesToDelete
			.map((t) => `"${t}"`)
			.join(", ")} RESTART IDENTITY CASCADE;`;

		this.logger.log(`🔥 Ejecutando: ${truncateQuery}`);

		// 4. Ejecutar usando sql.raw para enviar el string directo
		await this.db.execute(sql.raw(truncateQuery));
	}
}
