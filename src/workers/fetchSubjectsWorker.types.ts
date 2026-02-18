// Types shared between main thread and worker
// These must be kept separate from the main API types to avoid import issues in workers

import type { Subject } from "@/types/apiTypes";

export interface WorkerMessage {
	type: "start";
}

export interface WorkerProgressMessage {
	type: "progress";
	subjects: Subject[];
	current: number;
	total: number;
}

export interface WorkerCompleteMessage {
	type: "complete";
	subjects: Subject[];
	timestamp: number;
}

export interface WorkerErrorMessage {
	type: "error";
	error: string;
}

export type WorkerResponse =
	| WorkerProgressMessage
	| WorkerCompleteMessage
	| WorkerErrorMessage;
