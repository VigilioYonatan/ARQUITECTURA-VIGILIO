import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { CompanySchema } from "../schemas/company.schema";
import { EmpresaEntity } from "./empresa.entity";

@Table({ tableName: "company", timestamps: false })
export class CompanyEntity
    extends Model<CompanySchema, Omit<CompanySchema, "id">>
    implements CompanySchema
{
    declare id: number;

    @Column({ type: DataType.STRING(200) })
    declare ruc: string;

    @Column({ type: DataType.STRING(200) })
    declare razon_social: string;

    @Column({ type: DataType.STRING(200) })
    declare nombre_comercial: string;

    @Column({ type: DataType.STRING(100) })
    declare sol_user: string;

    @Column({ type: DataType.STRING(100) })
    declare sol_pass: string;

    @Column({ type: DataType.STRING(200) })
    declare client_id: string | null;

    @Column({ type: DataType.STRING(200) })
    declare client_secret: string | null;

    @Column({ type: DataType.STRING(200) })
    declare certificado_password: string | null;

    @Column({ type: DataType.STRING(20) })
    declare mode: CompanySchema["mode"];

    @Column({ type: DataType.JSON })
    declare logo_facturacion: CompanySchema["logo_facturacion"];

    @Column({ type: DataType.JSON })
    declare certificado_digital: CompanySchema["certificado_digital"];

    @ForeignKey(() => EmpresaEntity)
    @Column
    declare empresa_id: number;

    @BelongsTo(() => EmpresaEntity)
    declare emmpresa: EmpresaEntity;
}
