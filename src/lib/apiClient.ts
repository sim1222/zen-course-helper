// https://syllabus.zen.ac.jp/search/result?opening_year=2025&enrollment_grade=1&course_pattern_id=7&subject_category_id=basic&tag_id=108&quarter=3q&teaching_method=on-demand&credit=1&faculty_member_id=19&day_of_week=tuesday&sort=name-asc

import type { SearchResponse } from "@/types/apiTypes";
import type { QueryParams } from "./syllabusConsts";

function buildQueryParams(params: QueryParams): string {
	const searchParams = new URLSearchParams();
	/*
	key=value
	key=value1 value2  (配列の場合、スペース区切りで連結)
	  */
	for (const [key, value] of Object.entries(params)) {
		if (Array.isArray(value)) {
			searchParams.append(key, value.join(","));
		} else if (value !== undefined) {
			searchParams.append(key, String(value));
		}
	}
	return searchParams.toString();
}

export async function searchSubjects(args: QueryParams) {
	const response = await fetch(
		`https://api.syllabus.zen.ac.jp/search?${buildQueryParams(args)}`,
	);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	const data: Partial<SearchResponse> = await response.json();
	return data;
}
