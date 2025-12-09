export interface PaginatorResult<T> {
	success: true;
	results: T[];
	count: number;
	next: string | null;
	previous: string | null;
}
export interface PaginatorResultError {
	success: false;
	message: string;
	model: string;
}
