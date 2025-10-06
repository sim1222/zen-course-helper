import { cn } from "@/lib/utils";
import type { Tag } from "@/types/apiTypes";

export default function TagBadge(props: { tag: Tag; className?: string }) {
	const { tag } = props;
	return (
		<span
			className={cn([
				"badge badge-secondary bg-blue-50 rounded-2xl px-2 py-1 text-xs text-blue-900",
				props.className,
			])}
		>
			{tag.name}
		</span>
	);
}
