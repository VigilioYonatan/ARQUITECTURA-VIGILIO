import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Index,
    DefaultScope,
    Unique,
} from "sequelize-typescript";
import type { UserSchema } from "../schemas/user.schema";
import { Op } from "sequelize";

@DefaultScope(() => ({
    where: {
        status: {
            [Op.notIn]: ["bloqueo-definitivo"],
        },
    },
}))
@Table({ tableName: "user", paranoid: true })
export class User
    extends Model<UserSchema, Omit<UserSchema, "id">>
    implements UserSchema
{
    declare id: number;

    @Index
    @Column({ type: DataType.STRING(20) })
    declare code: string;

    @Index
    @Unique
    @Column({ type: DataType.STRING(100) })
    declare user_name: string;

    @Index
    @Unique("unique_full_name_father_lastname_mother_lastname")
    @Column({ type: DataType.STRING(100), allowNull: false })
    declare full_name: string;

    @Unique("unique_full_name_father_lastname_mother_lastname")
    @Column({ type: DataType.STRING(100), allowNull: false })
    declare father_lastname: string;

    @Unique("unique_full_name_father_lastname_mother_lastname")
    @Column({ type: DataType.STRING(100), allowNull: false })
    declare mother_lastname: string;

    @Column({ type: DataType.STRING(100), defaultValue: "masculino" })
    declare gender: UserSchema["gender"];

    @Index
    @Unique
    @Column({ type: DataType.STRING(255) })
    declare email: string | null;

    @Column({ type: DataType.STRING(50) })
    declare type_identification: UserSchema["type_identification"];

    @Index
    @Unique
    @Column({ type: DataType.STRING(100) })
    declare identification: string | null;

    @Column({ type: DataType.STRING(100) })
    declare password: string | null;

    @Column({ type: DataType.STRING(100) })
    declare profesion: string | null;

    @Column({ type: DataType.TEXT })
    declare presentation: string | null;

    @Column({ type: DataType.JSON })
    declare photo: UserSchema["photo"] | null;

    @Column({
        type: DataType.ENUM<UserSchema["role"]>(
            "super-admin",
            "administracion"
        ),
    })
    declare role: UserSchema["role"];

    @Column({ type: DataType.STRING(30) })
    declare telefono: string;

    @Column({
        type: DataType.STRING(30),
    })
    declare status: UserSchema["status"];

    @Column({
        type: DataType.INTEGER,
    })
    declare intentos_session: number;

    @Column({
        type: DataType.DATE,
    })
    declare intentos_session_date: Date | null;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null,
    })
    declare ultima_conexion: Date | null;

    @Column({ type: DataType.STRING(500) })
    declare address: string;

    @Column({ type: DataType.JSON })
    declare subscription: UserSchema["subscription"];

    @Index
    @Unique
    @Column({ type: DataType.STRING(255) })
    declare slug: string;

    // relations
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    declare user_id: number | null;

    @BelongsTo(() => User)
    declare user: User | null;

    declare deleted_at: Date | null;
}
