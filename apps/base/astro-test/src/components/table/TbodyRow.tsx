import { useContext } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import { VigilioTableContext } from "./VigilioTable";

interface TbodyRowProps<T extends object> {
	className?: string;
	handleClick?: (data: T) => void;
	children: (data: T) => JSX.Element | JSX.Element[];
	title: string | JSX.Element | JSX.Element[];
}
function TbodyRow<T extends object>({
	className = "hover:bg-primary/20! h-[60px]  border-border border-b hover:bg-paper-light text-foreground ",
	handleClick,
	children,
	title,
}: TbodyRowProps<T>) {
	const table = useContext(VigilioTableContext);
	function onClick(data: T) {
		if (handleClick) {
			handleClick(data);
		}
	}

	return (
		<>
			{table.pagination.value.total === 0 ? (
				<tr className="w-full text-center h-[300px]">
					<td colSpan={table.table.Thead().length} className="dark:text-white ">
						{title}
					</td>
				</tr>
			) : (
				table.table.TBody.Row().map(({ ...data }) => (
					<tr
						className={className}
						onClick={() => onClick(data as T)}
						key={data.index}
					>
						{children(data as T)}
					</tr>
				))
			)}
		</>
	);
}

export default TbodyRow;
