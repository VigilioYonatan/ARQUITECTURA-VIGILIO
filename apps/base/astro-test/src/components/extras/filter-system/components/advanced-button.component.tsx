import { cn, sizeIcon } from "@infrastructure/libs/client/helpers";
import { FilterIconSolid } from "@vigilio/react-icons/fontawesome";
import { useContext } from "preact/hooks";
import Button from "../../button";
import Modal from "../../modal";
import { filterContext } from "../context/filter.context";
import { Filter } from "./filter.component";

export interface AdvancedButtonProps {
    className?: string;
}

export function AdvancedButton({ className }: AdvancedButtonProps) {
    const context = useContext(filterContext);
    const { filters } = context;

    return (
        <>
            <Button
                type="button"
                variant="primary"
                onClick={filters.methods.openFilters}
                className={cn(
                    "flex items-center gap-2 w-full sm:!w-[160px]",
                    className
                )}
            >
                <FilterIconSolid {...sizeIcon.medium} />
                Filtros
                {filters.activeFiltersCount > 0 && (
                    <span className="bg-white text-primary text-xs px-2 py-1 rounded-full">
                        {filters.activeFiltersCount}
                    </span>
                )}
            </Button>
            <Modal
                isOpen={filters.isFilterOpen}
                onClose={filters.methods.closeFilters}
                content={
                    <div className="flex flex-col gap-4 font-bold text-2xl">
                        <span className="flex items-center gap-2">
                            <FilterIconSolid
                                className="fill-white"
                                {...sizeIcon.medium}
                            />
                            Filtros ({filters.activeFiltersCount})
                        </span>
                    </div>
                }
                contentClassName="min-h-[auto] max-w-[500px] w-full"
            >
                <Filter />
            </Modal>
        </>
    );
}
