import { cn } from "@infrastructure/libs/client/helpers";
import type { UsePaginator } from "@vigilio/preact-paginator";

interface PaginatorProps {
	paginator: UsePaginator;
	isFetching: boolean;
	only_next_back?: boolean;
}
function Paginator({ paginator, isFetching, only_next_back }: PaginatorProps) {
	if (paginator.pagination.paginator.totalPages < 0) return null;

	return (
		<div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 p-4 bg-card border-x border-b border-border rounded-xl">
			<span className="text-muted-foreground">
				Mostrando {paginator.pagination.paginator.totalItems} de{" "}
				{paginator.pagination.paginator.totalPages} resultados
			</span>
			<div className="flex items-center gap-2">
				<button
					onClick={() => paginator.pagination.onBackPage()}
					className={cn(
						"p-2 border border-border rounded-lg hover:bg-accent/20 transition-colors",
						"disabled:opacity-50 disabled:cursor-not-allowed",
						paginator.pagination.page === 1
							? "opacity-50 cursor-not-allowed"
							: "",
					)}
					type="button"
					disabled={paginator.pagination.page === 1 || isFetching}
					aria-label="button previous table"
				>
					&laquo;
				</button>
				{!only_next_back ? (
					<div className="flex gap-1">
						{paginator.pagination.paginator.pages.map((page) => (
							<div className="flex items-center" key={page}>
								{paginator.pagination.paginator.currentPage === page ? (
									<span className="px-3 py-1 border border-primary rounded-lg bg-primary text-white font-medium ">
										{page}
									</span>
								) : (
									<button
										type="button"
										className="px-3 py-1 border border-border rounded-lg hover:bg-accent/20 transition-colors text-muted-foreground"
										aria-label={`button change to page ${page} table`}
										onClick={() => paginator.pagination.onChangePage(page)}
										disabled={isFetching || false}
									>
										{page}
									</button>
								)}
							</div>
						))}
					</div>
				) : null}

				{paginator.pagination.paginator.currentPage !==
				paginator.pagination.paginator.totalPages ? (
					<button
						onClick={() => paginator.pagination.onNextPage()}
						className={cn(
							"p-2 border border-border rounded-lg hover:bg-accent/20 transition-colors",
							"disabled:opacity-50 disabled:cursor-not-allowed",
							paginator.pagination.page ===
								paginator.pagination.paginator.totalPages
								? "opacity-50 cursor-not-allowed"
								: "",
						)}
						type="button"
						disabled={
							paginator.pagination.page ===
								paginator.pagination.paginator.totalPages || isFetching
						}
						aria-label="button next page table"
					>
						&raquo;
					</button>
				) : null}
			</div>
		</div>
	);
}

export default Paginator;
