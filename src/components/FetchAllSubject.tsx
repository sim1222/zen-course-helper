import { useCallback, useEffect, useRef, useState } from "react";
import { useSubjectsStore } from "@/stores/subjectsStore";
import FetchSubjectsWorker from "@/workers/fetchSubjectsWorker?worker";
import type {
	WorkerMessage,
	WorkerResponse,
} from "@/workers/fetchSubjectsWorker.types";
import { Spinner } from "./ui/spinner";

// 1 week
const FETCH_INTERVAL = 1000 * 60 * 60 * 24 * 7;

export default function FetchAllSubject() {
	const workerRef = useRef<Worker | null>(null);
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [_progress, setProgress] = useState<{
		current: number;
		total: number;
	} | null>(null);

	const startFetch = useCallback(() => {
		const store = useSubjectsStore.getState();

		// Check if we need to fetch
		if (store.lastFetched) {
			const now = new Date();
			if (now.getTime() - store.lastFetched < FETCH_INTERVAL) {
				// Fetched recently, skip fetching
				return;
			}
		}

		// Don't fetch if already fetching
		if (workerRef.current) {
			return;
		}

		setIsFetching(true);
		setError(null);
		setProgress(null);
		store.clearSubjects();

		// Create and start the worker
		const worker = new FetchSubjectsWorker();
		workerRef.current = worker;

		worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
			const data = event.data;
			const currentStore = useSubjectsStore.getState();

			switch (data.type) {
				case "progress":
					// Add subjects to store incrementally
					currentStore.addSubjects(data.subjects);
					setProgress({ current: data.current, total: data.total });
					break;

				case "complete":
					currentStore.setLastFetched(data.timestamp);
					setIsFetching(false);
					setProgress(null);
					worker.terminate();
					workerRef.current = null;
					break;

				case "error":
					setError(data.error);
					setIsFetching(false);
					setProgress(null);
					worker.terminate();
					workerRef.current = null;
					break;
			}
		};

		worker.onerror = (err) => {
			setError(err.message || "Worker error occurred");
			setIsFetching(false);
			setProgress(null);
			worker.terminate();
			workerRef.current = null;
		};

		// Start fetching
		worker.postMessage({ type: "start" } satisfies WorkerMessage);
	}, []);

	// Start fetch on mount if no data exists or data is stale
	useEffect(() => {
		const shouldFetch = () => {
			const { subjects, lastFetched } = useSubjectsStore.getState();
			if (subjects.length === 0 || !lastFetched) {
				return true;
			}
			// Check if data is stale
			const now = new Date();
			return now.getTime() - lastFetched >= FETCH_INTERVAL;
		};

		if (shouldFetch()) {
			startFetch();
		}

		// Cleanup on unmount
		return () => {
			if (workerRef.current) {
				workerRef.current.terminate();
				workerRef.current = null;
			}
		};
	}, [startFetch]);

	return (
		<div className="w-4">
			{isFetching ? (
				<div className="flex items-center gap-2">
					<Spinner />
				</div>
			) : (
				error && (
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
						<span>{error ?? "An error occurred"}</span>
					</div>
				)
			)}
		</div>
	);
}
