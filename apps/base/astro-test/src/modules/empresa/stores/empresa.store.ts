import type { Global } from "@infrastructure/types/request";
import { useSignal } from "@preact/signals";
import type { EmpresaSchemaFromServer } from "../schemas/empresa.schema";

interface EmpresaStore {
	value: Global;
	updateEmpresa: (empresa_body: Partial<EmpresaSchemaFromServer>) => void;
}
export function useEmpresaStore(): EmpresaStore {
	const initialValue = useSignal<Global>(window.locals);

	function updateEmpresa(empresa_body: Partial<EmpresaSchemaFromServer>) {
		initialValue.value = {
			...initialValue.value,
			empresa: { ...initialValue.value.empresa, ...empresa_body },
		};
	}
	// function getFile(name: string) {
	//     const file = initialValue.value.files.find(
	//         (file) => file.name === name
	//     );
	//     if (!file) {
	//         // biome-ignore lint/suspicious/noConsole: <explanation>
	//         console.error(`File ${name} not found`);
	//         return NO_IMAGE_FOUND;
	//     }

	//     return printFileWithDimension(file.file, null)[0];
	// }
	return {
		value: initialValue.value,
		updateEmpresa,
	};
}
