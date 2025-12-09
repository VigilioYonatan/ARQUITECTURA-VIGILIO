import type { FilesSchema } from "@modules/uploads/modules/upload.schema";
import { UserEntity } from "@modules/user/entities/user.entity";
import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasOne,
    Model,
    Table,
} from "sequelize-typescript";
import type { EmpresaSchema } from "../schemas/empresa.schema";
import { AddressEntity } from "./address.entity";
import { CompanyEntity } from "./company.entity";

@Table({ tableName: "empresa" })
export class EmpresaEntity
    extends Model<EmpresaSchema, Omit<EmpresaSchema, "id">>
    implements EmpresaSchema
{
    declare id: number;

    @Column({
        type: DataType.STRING,
    })
    declare name_empresa: string;

    @Column({
        type: DataType.STRING(20),
    })
    declare dial_code: string;

    @Column({
        type: DataType.STRING(100),
    })
    declare model_ai_groq: string;

    @Column({
        type: DataType.STRING(20),
    })
    declare telefono: string;

    @Column({
        type: DataType.STRING(255),
    })
    declare token_ai: string;

    @Column({
        type: DataType.STRING(100),
    })
    declare color_primary: string;

    @Column({
        type: DataType.STRING(100),
    })
    declare timezone: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare enabled_automatic_payment: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare enabled_send_sunat: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare enabled_send_pdf: boolean;

    @Column({
        type: DataType.JSON,
    })
    declare logo_facturacion: FilesSchema[];

    @Column({
        type: DataType.JSON,
    })
    declare certificado_digital: FilesSchema[];

    @ForeignKey(() => AddressEntity)
    @Column
    declare address_id: number;

    @BelongsTo(() => AddressEntity)
    declare address: AddressEntity;

    @HasOne(() => CompanyEntity)
    declare company: CompanyEntity;

    @ForeignKey(() => UserEntity)
    @Column
    declare user_id: number;

    @BelongsTo(() => UserEntity)
    declare user: UserEntity;
}
