import { cn } from "@/lib/utils";

function QuarterIndicator({
	className,
	values,
	...props
}: {
	className?: string;
	values: Set<number>;
}) {
	return (
		<div
			className={cn(
				"inline-flex border border-gray-200 rounded overflow-hidden divide-x divide-gray-200",
				className,
			)}
			{...props}
		>
			{[1, 2, 3, 4].map((q) => (
				<span
					key={q}
					className={cn(
						"flex items-center justify-center w-5 h-5 text-[10px] font-bold",
						values.has(q) ? "bg-blue-800 text-white" : "bg-white text-gray-300",
					)}
				>
					{q}
				</span>
			))}
		</div>
	);
}

export { QuarterIndicator };
