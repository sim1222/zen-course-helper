import localForage from "localforage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Subject } from "@/types/apiTypes";

interface SubjectsState {
	subjects: Array<Subject>;
	lastFetched: number | null;
	setLastFetched: (timestamp: number | null) => void;
	addSubject: (subject: Subject) => void;
	addSubjects: (subjects: Array<Subject>) => void;
	removeSubject: (subjectNumber: string) => void;
	clearSubjects: () => void;
}

export const useSubjectsStore = create<SubjectsState>()(
	persist(
		(set) => ({
			subjects: [],
			lastFetched: null,
			setLastFetched: (timestamp: number | null) =>
				set(() => ({ lastFetched: timestamp })),
			addSubject: (subject: Subject) =>
				set((state) => ({
					subjects: [...state.subjects, subject],
				})),
			addSubjects: (subjects: Array<Subject>) =>
				set((state) => ({
					subjects: [...state.subjects, ...subjects],
				})),
			removeSubject: (subjectNumber: string) =>
				set((state) => ({
					subjects: state.subjects.filter(
						(subject) => subject.numbering !== subjectNumber,
					),
				})),
			clearSubjects: () => set(() => ({ subjects: [] })),
		}),
		{
			name: "subjects-storage",
			storage: createJSONStorage(() => localForage),
		},
	),
);
