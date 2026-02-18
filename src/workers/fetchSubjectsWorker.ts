// Web Worker for fetching subjects in background
// This prevents the UI thread from being blocked during initial load

// Types are inlined here because Workers have a separate module context
// and path aliases may not resolve correctly

interface Subject {
	numbering: string;
	name: string;
	description: string;
	thumbnailUrl: string;
	openingYear: string;
	faculty: unknown[];
	tags: unknown[];
	movieUrl: string;
	metadata: unknown;
	coursePlans: unknown[];
	relatedSubjects: unknown[];
	dayOfWeek: unknown[];
	subjectCategoryIds: string[];
	coursePatternIds: number[];
}

interface SearchResponse {
	totalCount: number;
	pageSize: number;
	page: number;
	totalPages: number;
	relatedTags: unknown[];
	subjects: Subject[];
}

type QueryParams = {
	page?: number;
};

function buildQueryParams(params: QueryParams): string {
	const searchParams = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (Array.isArray(value)) {
			searchParams.append(key, value.join(","));
		} else if (value !== undefined) {
			searchParams.append(key, String(value));
		}
	}
	return searchParams.toString();
}

async function searchSubjects(
	args: QueryParams,
): Promise<Partial<SearchResponse>> {
	const response = await fetch(
		`https://api.syllabus.zen.ac.jp/search?${buildQueryParams(args)}`,
	);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	const data: Partial<SearchResponse> = await response.json();
	return data;
}

// Worker internal types for postMessage (these are structurally compatible with the shared types)
interface WorkerProgressMessage {
	type: "progress";
	subjects: Subject[];
	current: number;
	total: number;
}

interface WorkerCompleteMessage {
	type: "complete";
	subjects: Subject[];
	timestamp: number;
}

interface WorkerErrorMessage {
	type: "error";
	error: string;
}

interface WorkerMessage {
	type: "start";
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
	if (event.data.type !== "start") {
		return;
	}

	try {
		const allSubjects: Subject[] = [];

		// Fetch the first page to get total pages
		const firstRes = await searchSubjects({});
		if (firstRes.subjects) {
			allSubjects.push(...firstRes.subjects);
			self.postMessage({
				type: "progress",
				subjects: firstRes.subjects,
				current: 1,
				total: firstRes.totalPages ?? 1,
			} satisfies WorkerProgressMessage);
		}

		if (firstRes.totalPages === undefined || firstRes.totalPages <= 1) {
			self.postMessage({
				type: "complete",
				subjects: allSubjects,
				timestamp: Date.now(),
			} satisfies WorkerCompleteMessage);
			return;
		}

		// Fetch remaining pages in batches to avoid overwhelming the server
		const BATCH_SIZE = 5;
		const totalPages = firstRes.totalPages;

		for (
			let batchStart = 2;
			batchStart <= totalPages;
			batchStart += BATCH_SIZE
		) {
			const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, totalPages);
			const promises = [];

			for (let page = batchStart; page <= batchEnd; page++) {
				promises.push(searchSubjects({ page }));
			}

			const results = await Promise.all(promises);
			const batchSubjects: Subject[] = [];

			for (const res of results) {
				if (res.subjects) {
					batchSubjects.push(...res.subjects);
				}
			}

			allSubjects.push(...batchSubjects);

			// Send progress update with batch subjects
			self.postMessage({
				type: "progress",
				subjects: batchSubjects,
				current: batchEnd,
				total: totalPages,
			} satisfies WorkerProgressMessage);
		}

		self.postMessage({
			type: "complete",
			subjects: allSubjects,
			timestamp: Date.now(),
		} satisfies WorkerCompleteMessage);
	} catch (error) {
		self.postMessage({
			type: "error",
			error: error instanceof Error ? error.message : "Unknown error occurred",
		} satisfies WorkerErrorMessage);
	}
};
