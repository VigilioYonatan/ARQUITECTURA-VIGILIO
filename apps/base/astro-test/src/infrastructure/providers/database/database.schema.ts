import { empresaEntity } from "@modules/empresa/entities/empresa.entity";
import { fileEntity } from "@modules/empresa/entities/file.entity";
import { iconEntity } from "@modules/empresa/entities/icon.entity";
import { cityEntity } from "@modules/ubigeo/entities/city.entity";
import { countryEntity } from "@modules/ubigeo/entities/country.entity";
import { regionEntity } from "@modules/ubigeo/entities/region.entity";
import { userEntity } from "@modules/users/entities/user.entity";

export const schema = {
	user: userEntity,
	empresa: empresaEntity,
	icon: iconEntity,
	file: fileEntity,
	country: countryEntity,
	region: regionEntity,
	city: cityEntity,
};
