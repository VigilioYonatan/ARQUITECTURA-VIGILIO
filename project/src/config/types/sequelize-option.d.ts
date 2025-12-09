// biome-ignore lint/correctness/noUnusedImports: <explanation>
import { Model, CreateOptions } from "sequelize";

declare module "sequelize" {
	interface CreateOptions {
		_timezone?: string;
	}
}
