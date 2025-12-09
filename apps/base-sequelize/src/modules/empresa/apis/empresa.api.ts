import { useMutation } from "@vigilio/preact-fetching";
import type { EmpresaUpdateDto } from "../dtos/empresa.dto";

/**
 * update - /api/empresa
 * @method PUT
 */
export function empresaUpdateApi() {
	return useMutation<
		EmpresaUpdateApiResult,
		EmpresaUpdateDto,
		EmpresaUpdateApiError
	>("/empresa", async (url, body) => {
		const response = await fetch(`/api${url}`, {
			method: "PUT",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const result = await response.json();
		if (!response.ok) {
			throw result;
		}
		return result;
	});
}
interface EmpresaUpdateApiResult {
	success: true;
	message: string;
}
interface EmpresaUpdateApiError {
	success: false;
	message: string;
	body: keyof EmpresaUpdateDto;
}
