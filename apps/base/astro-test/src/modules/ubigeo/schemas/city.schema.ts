import { number, object, string, type Input } from "@vigilio/valibot";

export const citySchema = object({
	id: number(),
	code: string(),
	name: string(),
	region_id: number(),
});
export type CitySchema = Input<typeof citySchema>;
