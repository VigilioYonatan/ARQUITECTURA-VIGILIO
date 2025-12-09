import { PipeTransform, BadRequestException, Injectable } from "@nestjs/common";
import {
    type ObjectEntriesAsync,
    type ObjectSchemaAsync,
    safeParse,
} from "@vigilio/valibot";

@Injectable()
export class ValibotPipe<T extends ObjectEntriesAsync>
    implements PipeTransform
{
    constructor(private schema: ObjectSchemaAsync<T>) {}

    async transform(value: Record<string, unknown>) {
        const result = await safeParse(this.schema, value);
        if (!result.success) {
            const issues = (result as any).issues.map((issue) => ({
                field: issue.path?.map((p) => p.key).join(".") || "unknown",
                message: issue.message,
            }));
            throw new BadRequestException({
                message: "Validation failed",
                errors: issues,
            });
        }
        return result.output;
    }
}
