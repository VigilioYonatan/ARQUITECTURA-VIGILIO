import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import type { RegionSchema } from "../schemas/region.schema";
import { CityEntity } from "./city.entity";
import { CountryEntity } from "./country.entity";

@Table({ timestamps: false, tableName: "region" })
export class RegionEntity extends Model implements Omit<RegionSchema, "id"> {
    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    declare code: string;

    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    declare name: string;

    @ForeignKey(() => CountryEntity)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    declare country_id: number;

    @HasMany(() => CityEntity)
    declare cities: CityEntity[];

    @BelongsTo(() => CountryEntity)
    declare country: CountryEntity;
}
