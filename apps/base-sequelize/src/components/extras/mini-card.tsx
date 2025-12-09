import { cn } from "@infrastructure/libs/client/helpers";

interface MiniCardProps {
    title: string;
    value: number;
    color?: string;
}
function MiniCard({
    title,
    value,
    color = "bg-primary/20 text-primary border border-primary/20",
}: MiniCardProps) {
    return (
        <div
            class={cn(
                "flex flex-col  items-center p-2 rounded-xl justify-center ",
                color
            )}
        >
            <span class="font-bold text-3xl">{value}</span>{" "}
            <span class="font-bold text-md !text-center">{title}</span>
        </div>
    );
}
export default MiniCard;
