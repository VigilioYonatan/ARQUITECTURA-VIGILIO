import { useQuery } from "@vigilio/preact-fetching";
import type { CitySchema } from "../schemas/city.schema";
import type { CountrySchema } from "../schemas/country.schema";
import type { RegionSchema } from "../schemas/region.schema";

export function unbigeoIndexApi() {
	return useQuery<UnbigeoIndexQueryAPI, UnbigeoIndexQueryAPIError>(
		"/ubigeo/",
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!response.ok) {
				throw result;
			}

			return result;
		},
	);
}

export interface UnbigeoIndexQueryAPI {
	success: boolean;
	data: (CountrySchema & {
		regions: (RegionSchema & {
			cities: CitySchema[];
		})[];
	})[];
}
interface UnbigeoIndexQueryAPIError {
	success: false;
	message: string;
}
