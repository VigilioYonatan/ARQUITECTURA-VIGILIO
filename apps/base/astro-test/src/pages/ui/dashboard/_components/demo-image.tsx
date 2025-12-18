import Image from "@components/extras/image";

export default function DemoImage() {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Images</h3>
            <div className="flex flex-wrap gap-4 items-end">
                <Image
                    src="https://vigilio-services.vercel.app/images/vigilio-services.webp"
                    alt="Vigilio Services"
                    title="Small"
                    size="sm"
                    className="rounded-lg shadow-sm"
                />
                <Image
                    src="https://vigilio-services.vercel.app/images/vigilio-services.webp"
                    alt="Vigilio Services"
                    title="Medium"
                    size="md"
                    className="rounded-lg shadow-sm"
                />
                <Image
                    src="https://vigilio-services.vercel.app/images/vigilio-services.webp"
                    alt="Vigilio Services"
                    title="Large"
                    size="lg"
                    className="rounded-lg shadow-sm"
                />
                <Image
                    src="https://vigilio-services.vercel.app/images/vigilio-services.webp"
                    alt="Vigilio Services"
                    title="Extra Large"
                    size="xl"
                    className="rounded-lg shadow-sm"
                />
            </div>
        </div>
    );
}
