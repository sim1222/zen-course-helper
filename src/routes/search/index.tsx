import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SubjectCard from "@/components/SubjectCard";
import { useSubjectsStore } from "@/stores/subjectsStore";

export const Route = createFileRoute("/search/")({
	component: RouteComponent,
});

function RouteComponent() {
	const subjects = useSubjectsStore();
	const [searchTerm, setSearchTerm] = useState("");
	return (
		<div>
			<input
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				placeholder="Search..."
			/>
			{subjects.subjects
				.filter((e) => (e.name + e.description).includes(searchTerm))
				.map((e) => (
					<div key={e.numbering}>
						{e.numbering}
						<SubjectCard subject={e} />
					</div>
				))}
		</div>
	);
}
