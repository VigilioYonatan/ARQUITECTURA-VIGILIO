import { useThemeStore } from "@stores/theme.store";
import { useForm } from "react-hook-form";
import "@vigilio/sweet/sweet.min.css";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    type IconStoreDto,
    iconStoreDto,
} from "@modules/empresa/dtos/icon.dto";
import Form from "./form";

function HelloWorld() {
    // console.log(env);
    const theme = useThemeStore();
    const iconStoreForm = useForm<IconStoreDto>({
        resolver: zodResolver(iconStoreDto),
    });
    function onIconStore(body: IconStoreDto) {
        console.log(body);
    }
    return (
        <div className="fixed top-2 right-2 p-2 rounded">
            <h1>hola 2</h1>
            <Form {...iconStoreForm} onSubmit={onIconStore}>
                <Form.control<IconStoreDto> name="name" title="Nombre" />
                <Form.control<IconStoreDto> name="slug" title="Slug" />
                <Form.control.file<IconStoreDto> name="photo" title="Foto" />
                <Form.button.submit
                    isLoading={iconStoreForm.formState.isSubmitting}
                    disabled={iconStoreForm.formState.isSubmitting}
                    title="Guardar"
                    loading_title="Guardando..."
                />
            </Form>
        </div>
    );
}

export default HelloWorld;
