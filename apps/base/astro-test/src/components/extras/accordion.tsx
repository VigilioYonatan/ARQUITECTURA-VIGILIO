import { cn } from "@infrastructure/libs/client/helpers";
import { useSignal } from "@preact/signals";
import { ChevronDownIconSolid } from "@vigilio/react-icons";
import type { JSX } from "preact/jsx-runtime";

interface AccordionItem {
	id: string;
	title: string;
	content: string | JSX.Element | JSX.Element[];
}

interface AccordionProps {
	items: AccordionItem[];
	allowMultiple?: boolean;
	className?: string;
}

function Accordion({
	items,
	allowMultiple = false,
	className,
}: AccordionProps) {
	const openItems = useSignal<Set<string>>(new Set());

	function toggleItem(itemId: string) {
		const newSet = new Set(openItems.value);
		if (newSet.has(itemId)) {
			newSet.delete(itemId);
		} else {
			if (!allowMultiple) newSet.clear();
			newSet.add(itemId);
		}
		openItems.value = newSet;
	}

	return (
		<div
			className={cn(
				"bg-card border border-border rounded-lg overflow-hidden",
				className,
			)}
		>
			{items.map((item) => {
				const isOpen = openItems.value.has(item.id);
				return (
					<div key={item.id} className="border-b border-border last:border-b-0">
						<button
							type="button"
							onClick={() => toggleItem(item.id)}
							className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-accent/20 transition-colors"
						>
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium text-foreground">
									{item.title}
								</span>
							</div>
							<ChevronDownIconSolid
								className={cn(
									"w-4 h-4 fill-accent-foreground text-muted-foreground transition-transform duration-200",
									isOpen && "rotate-180",
								)}
							/>
						</button>

						<div
							className={cn(
								"overflow-hidden transition-all duration-300",
								isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
							)}
						>
							<div className="px-4 pb-3 text-sm text-muted-foreground">
								{item.content}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default Accordion;
