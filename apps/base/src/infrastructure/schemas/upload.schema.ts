import {
	type Input,
	custom,
	number,
	object,
	optional,
	string,
} from "@vigilio/valibot";

export function filesSchema(dimensions?: number[]) {
	return object({
		dimension: optional(
			number([
				custom(
					(input) => !!dimensions?.includes(input),
					"Dimension Incorrecta",
				),
			]),
		),
		file: string(),
		name: string(),
		size: number(),
	});
}

export type FilesSchema = Input<ReturnType<typeof filesSchema>>;
