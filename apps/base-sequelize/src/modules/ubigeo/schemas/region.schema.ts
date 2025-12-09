import { number, object, string, type Input } from "@vigilio/valibot";

export const regionSchema = object({
    id: number(),
    code: string(),
    name: string(),
    country_id: number(),
});

export type RegionSchema = Input<typeof regionSchema>;

