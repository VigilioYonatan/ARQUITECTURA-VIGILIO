import Subtitle from "@components/extras/subtitle";
import Title from "@components/extras/title";

export default function DemoTypography() {
    return (
        <div className="flex flex-col gap-8">
            <h3 className="text-xl font-bold">Typography</h3>

            <div className="space-y-4 border p-4 rounded-lg">
                <span className="text-sm text-muted-foreground">Titles</span>
                <Title title="Standard Title" subtitle="With a subtitle" />
                <div className="h-px bg-border my-2" />
                <Title
                    title="Primary Title"
                    subtitle="Gradient styled text"
                    isPrimary
                />
            </div>

            <div className="space-y-4 border p-4 rounded-lg text-center">
                <span className="text-sm text-muted-foreground block text-left">
                    Subtitle
                </span>
                <Subtitle>Center Aligned Subtitle</Subtitle>
                <Subtitle className="text-left! text-primary">
                    Custom Styled Subtitle
                </Subtitle>
            </div>
        </div>
    );
}
