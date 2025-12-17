import { UsersRepository } from "@modules/users/repositories/users.repository";
import type { UserAuth } from "@modules/users/schemas/user.schema";
import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly usersRepository: UsersRepository) {
        super();
    }

    serializeUser(
        user: UserAuth,
        done: (err: Error | null, payload: number) => void
    ): void {
        done(null, user.id); // Save only ID in session
    }

    async deserializeUser(
        payload: number,
        done: (err: Error | null, user: UserAuth | null) => void
    ) {
        try {
            const user = await this.usersRepository.show(payload);
            done(null, user ? user : null);
        } catch (error) {
            done(error as Error, null);
        }
    }
}
