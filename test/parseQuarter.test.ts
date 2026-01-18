import { Quarter } from "@/lib/syllabusConsts";
import { parseQuarter } from "@/lib/utils";
import { expect, test } from "vitest";

test("parseQuarter", () => {
	const result1Q = parseQuarter(Quarter["1q"]);
	expect(result1Q).toEqual([1]);

	const result2Q = parseQuarter(Quarter["2q"]);
	expect(result2Q).toEqual([2]);

	const result3Q = parseQuarter(Quarter["3q"]);
	expect(result3Q).toEqual([3]);

	const result4Q = parseQuarter(Quarter["4q"]);
	expect(result4Q).toEqual([4]);

	const result1to2Q = parseQuarter(Quarter["1-2q"]);
	expect(result1to2Q).toEqual([1, 2]);

	const result3to4Q = parseQuarter(Quarter["3-4q"]);
	expect(result3to4Q).toEqual([3, 4]);

	const resultAnnual = parseQuarter(Quarter["annual"]);
	expect(resultAnnual).toEqual([1, 2, 3, 4]);

	const resultArray = parseQuarter([
		Quarter["1q"],
		Quarter["3-4q"],
		Quarter["annual"],
	]);
	expect(resultArray).toEqual([1, 2, 3, 4]);
});

