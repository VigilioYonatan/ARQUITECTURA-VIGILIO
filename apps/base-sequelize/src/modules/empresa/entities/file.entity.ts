import type { FilesSchema } from "@modules/uploads/modules/upload.schema";
import { UserEntity } from "@modules/user/entities/user.entity";
import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    Unique,
} from "sequelize-typescript";
import type { FileSchema } from "../schemas/file.schema";

@Table({ tableName: "file" })
export class FileEntity
    extends Model<FileSchema, Omit<FileSchema, "id">>
    implements FileSchema
{
    declare id: number;

    @Unique
    @Column({ type: DataType.STRING })
    declare name: string;

    @Column({ type: DataType.JSONB })
    declare file: FilesSchema[];

    @Column({ type: DataType.JSON })
    declare history: string[];

    @ForeignKey(() => UserEntity)
    @Column({ type: DataType.INTEGER })
    declare user_id: number;

    @BelongsTo(() => UserEntity)
    declare user: UserEntity;
}
