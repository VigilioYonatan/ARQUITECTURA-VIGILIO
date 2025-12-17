import type { FieldErrors } from "react-hook-form";
import WebFormVigilio from "./WebForm";
import WebFormArray from "./WebFormArray";
import WebFormButtonSubmit from "./WebFormButtonSubmit";
import FormControl from "./WebFormControl";
import WebFormFile from "./WebFormFile";
import WebFormSelect from "./WebFormSelect";
import WebFormSelectInput from "./WebFormSelectInput";

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

const WebForm = Object.assign(WebFormVigilio, {
	control: Object.assign(FormControl, {
		file: WebFormFile,
		select: WebFormSelect,
		array: WebFormArray,
		selectInput: WebFormSelectInput,
	}),
	button: { submit: WebFormButtonSubmit },
});
export default WebForm;
