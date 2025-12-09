import {
    BelongsTo,
    Column,
    DataType,
    DefaultScope,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { CitySchema } from "../schemas/city.schema";
import { RegionEntity } from "./region.entity";

@DefaultScope(() => ({ include: [RegionEntity] }))
@Table({ timestamps: false, tableName: "city" })
export class CityEntity extends Model implements Omit<CitySchema, "id"> {
    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    declare code: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    declare name: string;

    @ForeignKey(() => RegionEntity)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    declare region_id: number;

    @BelongsTo(() => RegionEntity)
    declare region: RegionEntity;
}
