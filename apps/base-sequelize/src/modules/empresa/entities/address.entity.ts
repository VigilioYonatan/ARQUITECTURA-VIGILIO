import { CityEntity } from "@modules/ubigeo/entities/city.entity";
import { UserEntity } from "@modules/user/entities/user.entity";
import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { AddressSchema } from "../schemas/address.schema";

@Table({ tableName: "address" })
export class AddressEntity
    extends Model<AddressSchema, Omit<AddressSchema, "id">>
    implements AddressSchema
{
    declare id: number;

    @Column({ type: DataType.STRING(10) })
    declare ubigeo: string;

    @Column({ type: DataType.STRING(300) })
    declare urbanizacion: string;

    @Column({ type: DataType.STRING(300) })
    declare direccion: string;

    @Column({ type: DataType.STRING(20) })
    declare cod_local: string;

    @ForeignKey(() => CityEntity)
    @Column
    declare city_id: number;

    @BelongsTo(() => CityEntity)
    declare city: CityEntity;

    @ForeignKey(() => UserEntity)
    @Column
    declare user_id: number;

    @BelongsTo(() => UserEntity)
    declare user: UserEntity;
}
