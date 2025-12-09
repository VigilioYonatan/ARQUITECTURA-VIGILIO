import Button from "@components/extras/button";
import { sizeIcon } from "@infrastructure/libs/client/helpers";
import {
    MagnifyingGlassIconSolid,
    TrashIconLight,
} from "@vigilio/react-icons/fontawesome";
import { sweetAlert } from "@vigilio/sweet";
import { useContext } from "preact/hooks";
import { VigilioTableContext } from "./VigilioTable";

interface ToolsProps {
    onRemoveAll?: (props: number[]) => void;
    hiddenInput?: boolean;
    hiddenDelete?: boolean;
    hiddenFetching?: boolean;
    placeholderSearch?: string;
}
function Tools({
    onRemoveAll,
    hiddenInput = false,
    hiddenDelete = false,
    hiddenFetching = false,
    placeholderSearch = "Buscar...",
}: ToolsProps) {
    const table = useContext(VigilioTableContext);

    function onRemove() {
        if (table.checks.isEmptyCheck()) {
            sweetAlert({
                icon: "info",
                title: "Seleccione que deseas borrar",
                timer: 10,
            });
            return;
        }
        if (onRemoveAll) {
            onRemoveAll(table.checks.value);
        }
    }
    return (
        <div class="flex ">
            {!hiddenInput ? (
                <div class="flex  gap-2 w-full md:w-[300px]">
                    <search class=" flex border border-border  gap-2 text-xs rounded-xl  overflow-hidden dark:text-secondary-light text-secondary-dark bg-card-foreground  shadow-sm  w-full">
                        <input
                            class="outline-none bg-transparent  w-full px-2 sm:text-sm font-normal   "
                            onChange={(e) =>
                                table.search.onSearchByName(
                                    e.currentTarget.value
                                )
                            }
                            value={table.search.value}
                            id="table-search-users"
                            placeholder={placeholderSearch}
                        />
                        <button
                            class="bg-primary px-3 fill-white  py-3 md:py-0"
                            type="button"
                        >
                            <MagnifyingGlassIconSolid width={18} height={18} />
                        </button>
                    </search>
                </div>
            ) : null}
            {!hiddenDelete ? (
                <div class="flex gap-4 items-center mx-2">
                    {table.pagination.value.total !== 0 ? (
                        <Button
                            class="dark:text-terciary text-secondary-dark py-3 md:py-0 "
                            type="button"
                            variant="outline"
                            aria-label="delete many"
                            onClick={onRemove}
                        >
                            <TrashIconLight {...sizeIcon.small} />
                        </Button>
                    ) : null}
                </div>
            ) : null}
            {!hiddenFetching ? (
                <div class="flex gap-4 items-center mx-2">
                    {table.isFetching ? <span>Cargando...</span> : null}
                </div>
            ) : null}
        </div>
    );
}

export default Tools;
