import Form from "@components/form";
import { type IconStoreDto } from "@modules/empresa/dtos/icon.dto";
import { sweetModal } from "@vigilio/sweet";
import { useHelloWorld } from "../hooks/use-hello-world.hook";

function HelloWorld() {
    const { iconStoreForm, onIconStore } = useHelloWorld();

    return (
        <div className="fixed top-2 right-2 p-2 rounded">
            <h1>hola esss</h1>
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
            <button
                type="button"
                onClick={() => {
                    sweetModal({
                        title: "hola",
                        text: "hola",
                        icon: "success",
                    });
                }}
            >
                ho
            </button>
        </div>
    );
}

export default HelloWorld;
