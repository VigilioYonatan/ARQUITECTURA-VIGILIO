import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ConfigService } from "@nestjs/config";

export interface Response<T> {
    success: boolean;
    timestamp?: string;
    data: T;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>>
{
    constructor(private configService: ConfigService) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<Response<T>> {
        const isProduction =
            this.configService.get<string>("NODE_ENV") === "production";

        return next.handle().pipe(
            map((data) => {
                const response: Response<T> = {
                    success: true,
                    data,
                };

                if (!isProduction) {
                    response.timestamp = new Date().toISOString();
                }

                return response;
            })
        );
    }
}
