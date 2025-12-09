import { sizeIcon } from "@infrastructure/libs/client/helpers";
import { RotateIconSolid } from "@vigilio/react-icons/fontawesome";
import { useContext } from "preact/hooks";
import Button from "../extras/button";
import { VigilioTableContext } from "./VigilioTable";

function Refetch() {
    const table = useContext(VigilioTableContext);
    if (table.pagination.value.total === 0) return null;
    return (
        <Button
            aria-label="refetch"
            type="button"
            className="bg-primary md:w-[190px] flex justify-center items-center rounded-xl cursor-pointer gap-2"
            onClick={async () => {
                await table.query.refetch(true);
            }}
        >
            <RotateIconSolid
                class={` fill-white ${
                    table.query.isFetching ? "animate-spin" : ""
                }`}
                {...sizeIcon.medium}
            />{" "}
            <span className="hidden md:block text-white text-sm">
                {table.query.isFetching ? "Refrescando..." : "Refrescar"}
            </span>
        </Button>
    );
}

export default Refetch;
