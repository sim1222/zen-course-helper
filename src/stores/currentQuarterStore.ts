import { create } from "zustand";
import { getAcademicYearByFormula, getQuarterByFormula } from "@/lib/utils";

interface currentQuarterState {
	Year: number;
	Quarter: number;
	setYear: (year: number) => void;
	setQuarter: (quarter: number) => void;
}

export const useCurrentQuarterStore = create<currentQuarterState>((set) => ({
	Year: getAcademicYearByFormula(new Date()),
	Quarter: getQuarterByFormula(new Date()),
	setYear: (year: number) => set(() => ({ Year: year })),
	setQuarter: (quarter: number) => set(() => ({ Quarter: quarter })),
}));
