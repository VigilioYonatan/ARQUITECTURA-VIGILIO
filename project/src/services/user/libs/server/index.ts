import cache from "@vigilio/express-core/cache";
import { Includeable, Op, WhereOptions } from "sequelize";
import { cacheGetJson, cacheTimes } from "@/infrastructure/libs/server/helpers";
import { User } from "@/user/entities/user.entity";
import { UserSchema } from "@/user/schemas/user.schema";

export function orWhereUser(search: string): WhereOptions {
    return {
        [Op.or]: [
            {
                full_name: {
                    [Op.iLike]: `%${search || ""}%`,
                },
            },
            {
                user_name: {
                    [Op.iLike]: `%${search || ""}%`,
                },
            },
            {
                identification: {
                    [Op.iLike]: `%${search || ""}%`,
                },
            },
        ],
    };
}

export function userModified(
    as: "user_academic" | "user_student" | "user",
    rest?: Omit<Includeable, "model" | "as" | "attributes">
): Includeable {
    return {
        model: User,
        as,
        attributes: [
            "id",
            "user_name",
            "full_name",
            "father_lastname",
            "mother_lastname",
            "photo",
            "role",
        ] as (keyof UserSchema)[],
        ...(rest || {}),
    };
}
export function userSelect(
    as: "user_student" | "user_academic" | "sender" | "user"
): Includeable {
    return {
        model: User,
        as,
        attributes: [
            "id",
            "user_name",
            "telefono",
            "identification",
            "type_identification",
            "photo",
            "full_name",
            "father_lastname",
            "mother_lastname",
            "role",
        ] as (keyof UserSchema)[],
    };
}

export async function userShow(id: string) {
    let user = cacheGetJson(`user:${id}`);
    if (!user) {
        user = await User.findByPk(id, {
            attributes: { exclude: ["password"] },
        });
        if (!user) {
            return null;
        }

        user = (user as User).get({ plain: true });
        cache.set(`user:${id}`, JSON.stringify(user), cacheTimes.days7);
    }
    return {
        success: true,
        user,
    };
}
