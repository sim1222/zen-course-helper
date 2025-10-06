import type { Faculty } from "@/types/apiTypes";

export default function FacultyBadge(props: { faculty: Faculty }) {
	const { faculty } = props;
	return (
		<div key={faculty.id} className="flex items-center">
			<img
				src={faculty.avatarUrl}
				alt={faculty.name}
				className="aspect-square rounded-full w-8 mx-2"
			/>
			<span className="text-sm text-gray-700">
				{faculty.name} ({faculty.title})
			</span>
		</div>
	);
}
