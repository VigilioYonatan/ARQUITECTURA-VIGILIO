import Form from "@components/form";
import { type Input, number, object, string } from "@vigilio/valibot";
import { valibotResolver } from "@vigilio/valibot/resolver";
import type { JSX } from "preact";
import { useForm } from "react-hook-form";

const a = object({
    name: string(),
    age: number(),
});
type A = Input<typeof a>;
interface CampusLayoutProps {
    children: JSX.Element | JSX.Element[];
}
function DashboardLayout({ children }: CampusLayoutProps) {
    const form = useForm<A>({ resolver: valibotResolver(a) });
    function onSubmit(data: A) {
        console.log(data);
    }
    return (
        <>
            <div className="flex gap-2 items-center">
                <div>Menu</div>
                <div></div>
                <Form onSubmit={onSubmit} {...form}>
                    <Form.control<A> name="name" title="Nombre" />
                    <Form.control<A> name="age" title="Edad" />
                    <Form.control.file multiple name="file" title="Archivo" />
                    <Form.button.submit
                        title="Enviar"
                        loading_title="Enviando..."
                        isLoading={form.formState.isSubmitting}
                    />
                </Form>
            </div>
            {children}
        </>
    );
}

export default DashboardLayout;
