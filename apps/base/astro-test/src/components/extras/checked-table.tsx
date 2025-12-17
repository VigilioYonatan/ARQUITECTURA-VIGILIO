import type { Columns } from "@vigilio/preact-table";

function CheckedTable<T, K extends string = "">(
	attribute: keyof T,
): Columns<T, K>[0] {
	return {
		key: attribute,
		header: (_, methods, props) => (
			<div class=" w-full flex items-center justify-center ">
				<input
					type="checkbox"
					class="w-4 h-4  bg-gray-100 border-gray-300 rounded  mx-auto "
					id="checkbox-table-search-1"
					checked={!methods.isEmptyCheck()}
					onChange={() => {
						const allChecked = props.every((item) =>
							methods.existCheck(item[attribute] as number),
						);
						for (const item of props) {
							if (allChecked) {
								// Deseleccionar solo los que están seleccionados
								if (methods.existCheck(item[attribute] as number)) {
									methods.onCheck(item[attribute] as number);
								}
							} else {
								// Seleccionar solo los que no están seleccionados
								if (!methods.existCheck(item[attribute] as number)) {
									methods.onCheck(item[attribute] as number);
								}
							}
						}
					}}
					indeterminate={!methods.isEmptyCheck()}
				/>
			</div>
		),
		cell: (props, _i, methods) => {
			return (
				<div class="flex items-center justify-center">
					<input
						type="checkbox"
						class="w-4 h-4  bg-gray-100 border-gray-300 rounded "
						checked={methods.existCheck(props[attribute] as number)}
						onChange={() => methods.onCheck(props[attribute] as number)}
					/>
				</div>
			);
		},
	};
}

export default CheckedTable;
