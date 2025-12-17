import { sizeIcon } from "@infrastructure/libs/client/helpers";
import { useSignal } from "@preact/signals";
import { SortIconSolid } from "@vigilio/react-icons/fontawesome";
import { useContext } from "preact/hooks";
import { VigilioTableContext } from "./VigilioTable";

interface ThProps {
	className?: string;
}
function Th({
	className = "px-2 py-4 font-medium tracking-wider text-center  cursor-pointer",
}: ThProps) {
	const table = useContext(VigilioTableContext);
	const isSorting = useSignal(false);

	return (
		<>
			{table.table.Thead().map(({ isSort, key, value, methods }) => (
				<th scope="col" className={className} key={key}>
					{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
					{/** biome-ignore lint/a11y/useAriaPropsSupportedByRole: <explanation> */}
					<div
						aria-label="button to sort"
						onClick={() => {
							if (isSort) {
								if (typeof isSort === "string") {
									methods?.sorting(isSort);
									return;
								}
								methods?.sorting(key);
							}
							isSorting.value = !isSorting.value;
						}}
						className="flex gap-2  items-center px-2 sort-button"
					>
						{isSort ? (
							<SortIconSolid
								className="mr-2 icon-up dark:fill-white"
								{...sizeIcon.small}
							/>
						) : null}
						<span class="line-clamp-1  w-full text-left text-foreground text-sm!">
							{value}
						</span>{" "}
					</div>
				</th>
			))}
		</>
	);
}

export default Th;
