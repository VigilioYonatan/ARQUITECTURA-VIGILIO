import {
	type Input,
	coerce,
	date,
	number,
	object,
	string,
} from "@vigilio/valibot";

export const feriadoSchema = object({
	id: number(),
	name: string(),
	date: coerce(date(), (value) => new Date(value as string)),
});
export type FeriadoSchema = Input<typeof feriadoSchema>;
