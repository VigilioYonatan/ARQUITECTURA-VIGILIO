import Paginator from "@components/extras/pagination";
import { useSignal } from "@preact/signals";

export default function DemoPaginator() {
    const page = useSignal(1);

    // biome-ignore lint/suspicious/noExplicitAny: Mocking complex type
    const mockPaginator: any = {
        pagination: {
            page: page.value,
            onNextPage: () => {
                page.value++;
            },
            onBackPage: () => {
                page.value--;
            },
            onChangePage: (p: number) => {
                page.value = p;
            },
            paginator: {
                totalPages: 5,
                totalItems: 50,
                currentPage: page.value,
                pages: [1, 2, 3, 4, 5],
                nextPage: page.value < 5 ? page.value + 1 : null,
                prevPage: page.value > 1 ? page.value - 1 : null,
            },
        },
    };

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Pagination</h3>
            <Paginator paginator={mockPaginator} isFetching={false} />
        </div>
    );
}
