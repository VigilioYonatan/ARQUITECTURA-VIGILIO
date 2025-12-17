import { type JSX } from "preact";
import Loader from "../extras/loader";

interface WebFormButtonSubmitProps {
	isLoading: boolean;
	loading_title: string;
	title: string;
	className?: string;
	ico?: JSX.Element | JSX.Element[] | null;
	disabled?: boolean;
	form?: string;
}
function WebFormButtonSubmit({
	isLoading,
	title,
	className,
	loading_title,
	disabled = false,
	ico,
	form,
}: WebFormButtonSubmitProps) {
	return (
		<button
			type="submit"
			form={form}
			className={`${className} disabled:opacity-50 disabled:cursor-not-allowed text-xs bg-primary py-3 px-8 font-bold rounded-md text-white  tracking-wider mx-auto uppercase mt-3 flex items-center gap-2 text-justify  `}
			disabled={disabled}
		>
			{isLoading ? (
				<>
					<Loader /> {loading_title}
				</>
			) : (
				<>
					{ico || null}
					{title}
				</>
			)}
		</button>
	);
}

export default WebFormButtonSubmit;
