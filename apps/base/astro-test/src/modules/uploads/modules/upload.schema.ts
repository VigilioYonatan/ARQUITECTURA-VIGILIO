import {
    custom,
    type Input,
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
                    "Dimension Incorrecta"
                ),
            ])
        ),
        key: string(),
        name: string(),
        size: number(),
        mimetype: string(),
    });
}

export type FilesSchema = Input<ReturnType<typeof filesSchema>>;
