// import validFileValibot from "@infrastructure/libs/client/valibot";
import { z } from "zod";
import { empresaSchema } from "../schemas/empresa.schema";

export const empresaUpdateDto = empresaSchema.omit({
    id: true,
    user_id: true,
    created_at: true,
    updated_at: true,
});
export type EmpresaUpdateDto = z.infer<typeof empresaUpdateDto>;

export const empresaUpdateLogoDto = z.object({
    logo: z.array(z.instanceof(File)).min(1).max(1),
});
export type EmpresaUpdateLogoDto = z.infer<typeof empresaUpdateLogoDto>;

export const empresaUpdateLogoLoadingDto = z.object({
    logo_loading: z.array(z.instanceof(File)).min(1).max(1),
});
export type EmpresaUpdateLogoLoadingDto = z.infer<
    typeof empresaUpdateLogoLoadingDto
>;
