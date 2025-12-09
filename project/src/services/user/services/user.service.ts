import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { generateId } from "@vigilio/express-core/helpers";
import { Op, WhereOptions } from "sequelize";
import { slugify } from "@/infrastructure/libs";
import {
    FiltersPaginator,
    generateCodeEntity,
    paginator,
} from "@/infrastructure/libs/server/helpers";
import { UserStoreDto, UserUpdateDto } from "../dtos/user.dto";
import { User } from "../entities/user.entity";
import { orWhereUser, userShow } from "../libs/server";
import type { UserAuth, UserSchema } from "../schemas/user.schema";

@Injectable()
export class UserService {
    constructor(
        @Inject("USER_REPOSITORY")
        private userRepository: typeof User
    ) {}
    async index(user: UserAuth, filters: FiltersPaginator<UserSchema>) {
        const result = await paginator<UserSchema>("user", {
            filters,
            cb: async (props) => {
                const { limit, offset, filters, search, ...resto } = props;
                let where: WhereOptions<User> = {
                    id: {
                        [Op.not]: [user.id],
                    },
                };
                // Logger.info({ search });
                if (filters?.role) {
                    where = {
                        ...where,
                        role: filters.role,
                    };
                }
                if (filters?.status) {
                    where = {
                        ...where,
                        status: filters.status,
                    };
                }

                const data = await Promise.all([
                    this.userRepository.findAll({
                        offset,
                        limit,
                        order: Object.entries(resto) as unknown as string[],
                        attributes: {
                            exclude: ["password"],
                        },
                        where: {
                            ...where,
                            ...orWhereUser(search || ""),
                        },
                    }),
                    this.userRepository.count({
                        where: {
                            ...where,
                            ...orWhereUser(search || ""),
                        },
                    }),
                ]);

                return data;
            },
        });
        return result;
    }

    async store(user: UserAuth, body: UserStoreDto) {
        const code = await generateCodeEntity(User, "code", "USER-");
        const slug = slugify(
            body.user_name ||
                `${body.full_name}${body.father_lastname}${generateId().slice(
                    -4,
                    4
                )}`
        );
        const usuario = new this.userRepository({
            ...body,
            code,
            user_id: user.id,
            intentos_session: 0,
            slug,
        });
        await usuario.save();
        return {
            success: true,
            user: usuario,
        };
    }
    async show(id: string) {
        const result = await userShow(id);
        if (!result) {
            throw new NotFoundException(
                `No se encontró un usuario con el id ${id}`
            );
        }
        return result;
    }
    async update(user: UserAuth, id: string, body: UserUpdateDto) {
        await this.userRepository.update(
            {
                ...body,
                user_id: user.id,
            },
            { where: { id: Number(id) } }
        );
        return {
            success: true,
            message: "User actualizado correctamente",
        };
    }

    // async updatePassword(id: string, body: UserUpdatePasswordDto) {
    //     const salt = await bcrypt.genSalt();
    //     const password = await bcrypt.hash(body.repeat_password!, salt);
    //     await User.update({ password }, { where: { id: Number(id) } });
    //     return {
    //         success: true,
    //         message: "Contraseña actualizada correctamente",
    //     };
    // }
    async destroy(id: string) {
        await this.userRepository.destroy({
            where: { id: Number(id) },
        });
        return {
            success: true,
            message: "User eliminado correctamente",
        };
    }
    async destroyUsers(ids: number[]) {
        const users = await this.userRepository.destroy({
            where: { id: { [Op.in]: ids } },
        });
        return { success: true, users };
    }
}
