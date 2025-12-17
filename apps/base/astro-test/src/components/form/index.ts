import type { FieldErrors } from "react-hook-form";
import VigilioForm from "./Form";
import FormControlArea from "./FormArea";
import FormArray from "./FormArray";
import FormButton from "./FormButton";
import FormButtonSubmit from "./FormButtonSubmit";
import FormCheck from "./FormCheck";
import FormColor from "./FormColor";
import FormControl from "./FormControl";
import FormFile from "./FormFile";
import FormSelect from "./FormSelect";
import FormSelectInput from "./FormSelectInput";
import FormToggle from "./FormToggle";

export function anidarPropiedades<T extends object>(
	obj: FieldErrors<T>,
	keysArray: string[],
) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let currentObj: any = obj;

	for (let i = 0; i < keysArray.length; i++) {
		const key = keysArray[i];

		// si no existe o no es un objeto, lo inicializamos
		if (typeof currentObj[key] !== "object" || currentObj[key] === null) {
			currentObj[key] = {};
		}

		currentObj = currentObj[key];
	}

	return currentObj;
}
export function extractErrors(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	obj: any,
	prefix = "",
): { field: string; message: string }[] {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const list: any[] = [];

	for (const [key, value] of Object.entries(obj)) {
		const fieldName = prefix ? `${prefix}.${key}` : key;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		if (value && typeof value === "object" && (value as any).message) {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			list.push({ field: fieldName, message: (value as any).message });
		} else if (typeof value === "object") {
			list.push(...extractErrors(value, fieldName));
		}
	}

	return list;
}

const Form = Object.assign(VigilioForm, {
	control: Object.assign(FormControl, {
		file: FormFile,
		toggle: FormToggle,
		select: FormSelect,
		area: FormControlArea,
		array: FormArray,
		check: FormCheck,
		selectInput: FormSelectInput,
		color: FormColor,
		button: FormButton,
	}),
	button: { submit: FormButtonSubmit },
});
export default Form;
