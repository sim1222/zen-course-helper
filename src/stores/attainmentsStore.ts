import { create } from "zustand";
import type { Subject } from "@/types/apiTypes";

export type Attainment = {
	subject: Subject | null;
	name: string;
	credits: number | null;
	grade: string;
	isIncludeInGPA: boolean;
	teacher: string;
};

interface AttainmentState {
	Attainments: Array<Attainment>;
	setAttainments: (attainments: Array<Attainment>) => void;
	clearAttainments: () => void;
}

export const useAttainmentsStore = create<AttainmentState>((set) => ({
	Attainments: [],
	setAttainments: (attainments) => set(() => ({ Attainments: attainments })),
	clearAttainments: () => set(() => ({ Attainments: [] })),
}));
