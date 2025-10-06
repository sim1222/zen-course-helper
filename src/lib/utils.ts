import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Subject } from "@/types/apiTypes";

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

// https://syllabus.zen.ac.jp/subjects/2025/INT-1-A1-1030-001
export function syllabusUrl(subject: Subject) {
	const baseUrl = "https://syllabus.zen.ac.jp/subjects";
	const year = subject.openingYear;
	const courseCode = subject.numbering.replaceAll(" ", "");
	return `${baseUrl}/${year}/${courseCode}`;
}
