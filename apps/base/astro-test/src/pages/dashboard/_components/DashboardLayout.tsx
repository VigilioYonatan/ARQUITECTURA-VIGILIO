import Form from "@components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type JSX } from "preact";
import { useForm } from "react-hook-form";
import { z } from "zod";

const a = z.object({
    name: z.string(),
    age: z.number(),
});
type A = z.infer<typeof a>;
interface CampusLayoutProps {
    children: JSX.Element | JSX.Element[];
}
function DashboardLayout({ children }: CampusLayoutProps) {
    const form = useForm<A>({ resolver: zodResolver(a) });
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
