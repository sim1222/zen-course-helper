import {
	parseCourseCode,
} from "@/lib/numberingParser";
import { expect, test } from "vitest";

test("numberingParser", () => {
	const res = parseCourseCode("INT-1-A1-1030-001");
	const labels = {
		field: "導入科目",
		year: 1,
		attribute: "必修",
		method: "オンデマンド",
		term: new Set([1,3]),
	};
	expect(res.labels).toEqual(labels);
});
