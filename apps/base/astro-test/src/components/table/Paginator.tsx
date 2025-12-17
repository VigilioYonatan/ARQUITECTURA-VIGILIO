import { useContext } from "preact/hooks";
import Loader from "../extras/loader";
import { VigilioTableContext } from "./VigilioTable";

function Paginator() {
	const table = useContext(VigilioTableContext);
	if (table.pagination.totalPages < 2) return null;
	return (
		<div className="flex flex-col gap-2 items-center">
			<div className="flex space-x-2">
				<button
					onClick={() => table.pagination.onBackPage()}
					className="text-2xl text-primary"
					type="button"
					aria-label="button previous table"
				>
					&laquo;
				</button>
				{table.pagination.paginator.pages.map((page) => (
					<div class="flex items-center" key={page}>
						{table.pagination.paginator.currentPage === page ? (
							<span className="px-3 py-1 border border-primary rounded bg-primary text-white">
								{page}
							</span>
						) : (
							<button
								type="button"
								className="px-3 py-1 text-primary bg-card-foreground border border-primary rounded hover:bg-primary hover:text-white"
								aria-label="button change page table"
								onClick={() => table.pagination.onChangePage(page)}
							>
								{page}
							</button>
						)}
					</div>
				))}

				<button
					onClick={() => table.pagination.onNextPage()}
					className="text-2xl text-primary"
					type="button"
					aria-label="button next page table"
				>
					&raquo;
				</button>
			</div>
			{table.query.isFetching ? (
				<div className="flex items-center justify-center gap-2 text-xs text-gray-500">
					<Loader variant="spinner" size="sm" />
					Cargando...
				</div>
			) : (
				<div class="h-[3px]" />
			)}
		</div>
	);
}

export default Paginator;
