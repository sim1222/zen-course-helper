import { create } from "zustand";
import {
	DEFAULT_QUARTER_OFFSET,
	getAcademicYearByFormula,
	getQuarterByFormula,
} from "@/lib/utils";

interface currentQuarterState {
	Year: number;
	Quarter: number;
	setYear: (year: number) => void;
	setQuarter: (quarter: number) => void;
}

export const useCurrentQuarterStore = create<currentQuarterState>((set) => {
	const currentDate = new Date();
	currentDate.setMonth(currentDate.getMonth() + DEFAULT_QUARTER_OFFSET);

	return {
		Year: getAcademicYearByFormula(currentDate),
		Quarter: getQuarterByFormula(currentDate),
		setYear: (year: number) => set(() => ({ Year: year })),
		setQuarter: (quarter: number) => set(() => ({ Quarter: quarter })),
	};
});
