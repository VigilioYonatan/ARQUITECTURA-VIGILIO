import VigilioForm from "./Form";
import FormControlArea from "./FormArea";
import FormButton from "./FormButton";
import FormButtonSubmit from "./FormButtonSubmit";
import FormCheck from "./FormCheck";
import FormControl from "./FormControl";
import FormSelect from "./FormSelect";
import FormToggle from "./FormToggle";
import FormArray from "./form-array";
import { FormColor } from "./form-color";
import FormFile from "./form-file";
import FormSelectInput from "./form-select-input";

export * from "./libs";

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
