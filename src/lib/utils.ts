import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Subject } from "@/types/apiTypes";
import type { ValueOf } from "@/types/utilTypes";
import { Quarter } from "./syllabusConsts";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/*
	Q1: 4,5,6
	Q2: 7,8,9
	Q3: 10,11,12
	Q4: 1,2,3
  */
export function getQuarterByFormula(date: Date): 1 | 2 | 3 | 4 {
	const month = date.getMonth() + 1;
	// 4月始まりにしたいので (month + 8) % 12 でシフト
	return (Math.floor(((month + 8) % 12) / 3) + 1) as 1 | 2 | 3 | 4;
}

export function getAcademicYearByFormula(date: Date): number {
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	// 4月始まりなので、1~3月の場合は前年を返す
	return month >= 4 ? year : year - 1;
}

export function parseQuarter(
	quarter: ValueOf<typeof Quarter> | ValueOf<typeof Quarter>[],
): (1 | 2 | 3 | 4)[] | null {
	function quarterToNumbers(q: ValueOf<typeof Quarter>): (1 | 2 | 3 | 4)[] {
		switch (q) {
			case Quarter["1q"]:
				return [1];
			case Quarter["2q"]:
				return [2];
			case Quarter["3q"]:
				return [3];
			case Quarter["4q"]:
				return [4];
			case Quarter["1-2q"]:
				return [1, 2];
			case Quarter["3-4q"]:
				return [3, 4];
			case Quarter["annual"]:
				return [1, 2, 3, 4];
			default:
				return [];
		}
	}

	if (Array.isArray(quarter)) {
		const resultSet = new Set<1 | 2 | 3 | 4>();
		quarter.forEach((q) => {
			quarterToNumbers(q).forEach((num) => {
				resultSet.add(num);
			});
		});
		return Array.from(resultSet);
	} else {
		return quarterToNumbers(quarter);
	}
}

// https://syllabus.zen.ac.jp/subjects/2025/INT-1-A1-1030-001
export function syllabusUrl(subject: Subject) {
	const baseUrl = "https://syllabus.zen.ac.jp/subjects";
	const year = subject.openingYear;
	const courseCode = subject.numbering.replaceAll(" ", "");
	return `${baseUrl}/${year}/${courseCode}`;
}
