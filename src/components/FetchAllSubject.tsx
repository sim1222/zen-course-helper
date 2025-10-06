import { useQuery } from "@tanstack/react-query";
import { searchSubjects } from "@/lib/apiClient";
import { useSubjectsStore } from "@/stores/subjectsStore";
import { Spinner } from "./ui/spinner";

// 1 week
const FETCH_INTERVAL = 1000 * 60 * 60 * 24 * 7;

export default function FetchAllSubject() {
	const subjectsStore = useSubjectsStore();

	const result = useQuery({
		queryKey: ["allSubjects"],
		retry: false,
		initialData: subjectsStore.subjects.length
			? subjectsStore.subjects
			: undefined,
		queryFn: async () => {
			if (subjectsStore.lastFetched) {
				const now = new Date();
				if (now.getTime() - subjectsStore.lastFetched < FETCH_INTERVAL) {
					// Fetched recently, skip fetching
					return subjectsStore.subjects;
				}
			}

			subjectsStore.clearSubjects();

			const firstRes = await searchSubjects({});
			if (firstRes.subjects) {
				subjectsStore.addSubjects(firstRes.subjects);
			}
			if (firstRes.totalPages === undefined || firstRes.totalPages <= 1) {
				return;
			}
			const promises = [];
			for (let page = 2; page <= (firstRes.totalPages ?? 0); page++) {
				promises.push(
					searchSubjects({
						page,
					}),
				);
			}
			const results = await Promise.all(promises);
			results.forEach((res) => {
				if (res.subjects) {
					subjectsStore.addSubjects(res.subjects);
				}
			});

			subjectsStore.setLastFetched(Date.now());

			return subjectsStore.subjects;
		},
	});

	return (
		<div>
			{result.isFetching ? (
				<Spinner />
			) : (
				result.isError && (
					<div className="text-red-600 flex items-center gap-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							className="bi bi-exclamation-triangle block"
							viewBox="0 0 16 16"
						>
							<title>Error</title>
							<path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
							<path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
						</svg>
						<span>
							{(result.error as Error)?.message ?? "An error occurred"}
						</span>
					</div>
				)
			)}
		</div>
	);
}
