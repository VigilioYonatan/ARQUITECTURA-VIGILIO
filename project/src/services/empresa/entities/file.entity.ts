import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    Unique,
} from "sequelize-typescript";
import { FileSchema } from "../schemas/file.schema";
import { FilesSchema } from "@/infrastructure/schemas/upload.schema";
import { User } from "@/user/entities/user.entity";

@Table({ tableName: "file" })
export class FileEntity
    extends Model<FileSchema, Omit<FileSchema, "id">>
    implements FileSchema
{
    declare id: number;

    @Unique
    @Column({ type: DataType.STRING })
    declare name: string;

    @Column({ type: DataType.JSON })
    declare file: FilesSchema[];

    @Column({ type: DataType.JSON })
    declare history: string[];

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    declare user_id: number;

    @BelongsTo(() => User)
    declare user: User;
}
