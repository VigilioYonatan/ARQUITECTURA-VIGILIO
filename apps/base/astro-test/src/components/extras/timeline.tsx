import { cn } from "@infrastructure/libs/client/helpers";
import {
	CheckIconSolid,
	CircleExclamationIconSolid,
	ClockIconSolid,
} from "@vigilio/react-icons";
import type { JSX } from "preact/jsx-runtime";

type TimelineStatus = "completed" | "current" | "pending" | "error";

interface TimelineItem {
	id: string;
	title: string;
	description: string;
	date: string;
	status: TimelineStatus;
	icon?: React.ReactNode;
}

interface TimelineProps {
	items: TimelineItem[];
	className?: string;
}

function Timeline({ items, className }: TimelineProps) {
	const statusIcons: Record<TimelineStatus, JSX.Element> = {
		completed: <CheckIconSolid className="w-4 h-4 fill-white" />,
		current: <ClockIconSolid className="w-4 h-4  fill-white " />,
		pending: <ClockIconSolid className="w-4 h-4 dark:fill-black fill-white!" />,
		error: <CircleExclamationIconSolid className="w-4 h-4 " />,
	};

	const statusColors: Record<TimelineStatus, string> = {
		completed: "bg-green-500 text-white",
		current: "bg-primary text-primary-foreground",
		pending: "bg-muted text-muted-foreground",
		error: "bg-red-500 text-white",
	};

	const lineColors: Record<TimelineStatus, string> = {
		completed: "bg-green-500",
		current: "bg-primary",
		pending: "bg-muted",
		error: "bg-red-500",
	};

	return (
		<div className={cn("space-y-6", className)}>
			{items.map((item, index) => (
				<div key={item.id} className="relative flex gap-4">
					{/* Timeline Line */}
					{index < items.length - 1 && (
						<div
							className={cn(
								"absolute left-4 top-8 w-0.5 h-full -translate-x-1/2",
								lineColors[item.status],
							)}
						/>
					)}

					{/* Timeline Icon */}
					<div
						className={cn(
							"flex items-center justify-center w-8 h-8 rounded-full border-2 border-background dark:border-border shadow-sm transition-all duration-300",
							statusColors[item.status],
						)}
					>
						{item.icon || statusIcons[item.status]}
					</div>

					{/* Timeline Content */}
					<div className="flex-1 min-w-0 pb-6">
						<div className="flex items-center justify-between mb-1 gap-1">
							<h3
								className={cn(
									"font-medium",
									item.status === "completed"
										? "text-foreground"
										: item.status === "current"
											? "text-primary"
											: item.status === "error"
												? "text-red-600"
												: "text-muted-foreground",
								)}
							>
								{item.title}
							</h3>
							<time className="text-sm text-muted-foreground">{item.date}</time>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							{item.description}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}
export default Timeline;
