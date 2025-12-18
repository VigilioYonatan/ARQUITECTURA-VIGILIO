import { cn } from "@infrastructure/libs/client/helpers";
import { ListIconSolid, TableCellsIconSolid } from "@vigilio/react-icons/fontawesome";
import { useContext } from "preact/hooks";
import Button from "../../button";
import { filterContext } from "../context/filter.context";

export interface ViewToggleProps {
    className?: string;
}

export function ViewToggle({ className }: ViewToggleProps) {
    const context = useContext(filterContext);
    const { typeView } = context;

    return (
        <div className={cn("flex", className)}>
            <Button
                type="button"
                variant={typeView.value === "table" ? "primary" : "outline"}
                className={cn(
                    "p-2 rounded-l-lg border rounded-r-none border-gray-300 transition-colors"
                )}
                onClick={() => typeView.methods.toggleTypeView("table")}
            >
                <TableCellsIconSolid
                    className={cn(
                        "w-5 h-5",
                        typeView.value === "table" ? "fill-white" : "fill-gray-600"
                    )}
                />
            </Button>
            <Button
                type="button"
                variant={typeView.value === "list" ? "primary" : "outline"}
                className={cn(
                    "p-2 rounded-r-lg border rounded-l-none border-gray-300 transition-colors"
                )}
                onClick={() => typeView.methods.toggleTypeView("list")}
            >
                <ListIconSolid className={cn("w-5 h-5")} />
            </Button>
        </div>
    );
}
