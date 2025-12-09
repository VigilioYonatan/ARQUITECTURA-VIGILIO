import {
    BadRequestException,
    Injectable,
    type PipeTransform,
} from "@nestjs/common";
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
            throw new BadRequestException({
                message: result.issues[0]?.message || "Validation failed",
                body: result.issues[0]?.path
                    ? result.issues[0]?.path[0]?.key
                    : result.issues[0]?.validation,
            });
        }
        return result.output;
    }
}
