import type { ValueOf } from "@/types/utilTypes";
import z from "zod";

// ---------- 定義 / マスタ ----------
export const FIELD = {
	INT: "導入科目",
	BSC: "基礎科目",
	INF: "情報",
	MTH: "数理",
	LAN: "多言語情報理解",
	HUM: "文化・思想",
	SOC: "社会・ネットワーク",
	ECON: "経済・マーケット",
	DIGI: "デジタル産業",
	CAR: "社会接続",
	OPT: "自由",
	PRJ: "卒業プロジェクト",
} as const;

export const FIELD_KEYS = Object.keys(FIELD) as [
	keyof typeof FIELD,
	...Array<keyof typeof FIELD>,
];
export type FieldCode = keyof typeof FIELD;

export const YEAR = {
	1: "1年次",
	2: "2年次",
	3: "3年次",
	4: "4年次",
} as const;
export const YEAR_CODES = ["1", "2", "3", "4"] as const;
export type YearCode = 1 | 2 | 3 | 4;

export const ATTRIBUTE = {
	A: "必修",
	B: "選択必修",
	C: "選択",
	D: "自由",
} as const;
export const ATTRIBUTE_KEYS = Object.keys(ATTRIBUTE) as [
	keyof typeof ATTRIBUTE,
	...Array<keyof typeof ATTRIBUTE>,
];
export type AttributeCode = keyof typeof ATTRIBUTE;

export const METHOD = {
	1: "オンデマンド",
	2: "ライブ映像",
	3: "演習",
	4: "ゼミ",
} as const;
export const METHOD_KEYS = [1, 2, 3, 4] as const;
// Keys of METHOD as numbers
export type MethodCode = keyof typeof METHOD;

export type Quarter = 1 | 2 | 3 | 4;

// TERM (開講時期) definition for labels
// This is slightly dynamic as it depends on the code, but for labels we can just show the code or a formatted version.
// For now, let's keep a simple mapping or logic if needed.
// The original code had `TERM` used in `isTerm` check but it wasn't fully defined in the constant section shown.
// We will implement validation logic.

// ---------- Zod Schemas ----------

const zField = z.enum(FIELD_KEYS);

// Year comes in as string in the code parts usually, but we want to map it to number
const zYear = z
	.enum(YEAR_CODES)
	.transform((val) => parseInt(val, 10) as YearCode);

const zAttribute = z.enum(ATTRIBUTE_KEYS);

// Method can be "1", "2", "3", "4" in string representation
const zMethod = z
	.enum(["1", "2", "3", "4"])
	.transform((val) => parseInt(val, 10) as MethodCode);

const zTermCode = z
	.string()
	.length(4, "term は4桁である必要があります")
	.regex(/^[0-4]{4}$/, "term は 0〜4 の数字のみ")
	.refine((s) => {
		const a = s.split("");
		return a.every((ch, i) => ch === "0" || ch === String(i + 1));
	}, "term の各桁は、非0ならその桁のQ番号でなければなりません")
	.refine((s) => /[1-4]/.test(s), "term は最低1つの四半期を含む必要があります");

export type TermCode = z.infer<typeof zTermCode>;

const zSerial = z
	.string()
	.regex(/^\d{1,3}$/, "serial は 1〜3桁の数字")
	.transform((val) => parseInt(val, 10))
	.refine((n) => n >= 0 && n <= 999, "serial は 0〜999 の範囲");

export type SerialNumber = number;

// ---------- 型 ----------

export interface CourseNumber {
	field: FieldCode;
	year: YearCode;
	attribute: AttributeCode;
	method: MethodCode;
	term: TermCode;
	serial: SerialNumber;
}

export interface ParsedCourseNumber extends CourseNumber {
	labels: {
		field: ValueOf<typeof FIELD>;
		year: YearCode;
		attribute: ValueOf<typeof ATTRIBUTE>;
		method: ValueOf<typeof METHOD>;
		term: Set<Quarter>;
	};
	source: string;
	normalizedFormat: "5-part" | "6-part";
}

// ---------- Logic Functions ----------

export function termCodeToQuarters(code: TermCode): Quarter[] {
	const parsed = zTermCode.parse(code);
	const out: Quarter[] = [];
	for (let i = 0; i < 4; i++) {
		if (parsed[i] !== "0") out.push((i + 1) as Quarter);
	}
	return out;
}

export function quartersToTermCode(qs: Quarter[]): TermCode {
	if (!Array.isArray(qs) || qs.length === 0) {
		throw new Error("quartersToTermCode: 四半期配列は1つ以上必要です");
	}
	const uniqSorted = Array.from(new Set(qs)).sort((a, b) => a - b) as Quarter[];
	const digits = ["0", "0", "0", "0"];
	for (const q of uniqSorted) {
		if (q < 1 || q > 4) throw new Error(`四半期は1〜4のみ: ${q}`);
		digits[q - 1] = String(q);
	}
	const code = digits.join("");
	return zTermCode.parse(code);
}

// ---------- Parser ----------

/**
 * 入力は以下の両方をサポート:
 *  - 6分割: INT-1-A-1-1030-001
 *  - 5分割: BSC-1-B1-1030-001  // ③属性+④方法を結合
 */
export function parseCourseCode(code: string): ParsedCourseNumber {
	const parts = code.trim().split("-");
	if (parts.length !== 6 && parts.length !== 5) {
		throw new Error(
			`Invalid format: expected 6 or 5 parts separated by "-", got ${parts.length}`,
		);
	}

	const isSixPart = parts.length === 6;

	// 1. Field
	const field = zField.parse(parts[0]);

	// 2. Year
	const year = zYear.parse(parts[1]);

	// 3 & 4. Attribute & Method
	let attribute: AttributeCode;
	let method: MethodCode;

	if (isSixPart) {
		attribute = zAttribute.parse(parts[2]);
		method = zMethod.parse(parts[3]);
	} else {
		// 5-part split. part[2] is combined "A1", "B2" etc.
		const combined = parts[2];
		const match = /^([A-D])([1-4])$/.exec(combined);
		if (!match) {
			throw new Error(`Invalid combined attribute/method: "${combined}"`);
		}
		attribute = zAttribute.parse(match[1]);
		method = zMethod.parse(match[2]);
	}

	// 5. Term (index 4 or 3)
	const termStr = isSixPart ? parts[4] : parts[3];
	const term = zTermCode.parse(termStr);

	// 6. Serial (index 5 or 4)
	const serialStr = isSixPart ? parts[5] : parts[4];
	const serial = zSerial.parse(serialStr);

	return {
		field,
		year,
		attribute,
		method,
		term,
		serial,
		labels: {
			field: FIELD[field],
			year,
			attribute: ATTRIBUTE[attribute],
			method: METHOD[method],
			term: new Set(termCodeToQuarters(term)),
		},
		source: code,
		normalizedFormat: isSixPart ? "6-part" : "5-part",
	};
}

// ---------- Builder ----------

export interface BuildOptions {
	/** デフォルト: false（6分割）。true の場合は ③+④ を結合して 5分割を出力 */
	combineAttrAndMethod?: boolean;
	/** 連番のゼロ埋め桁数。デフォルト 3（例: 1 -> 001） */
	serialWidth?: number;
}

const pad = (n: number, width = 3) => n.toString().padStart(width, "0");

export function buildCourseCode(
	c: CourseNumber,
	opts: BuildOptions = {},
): string {
	const { combineAttrAndMethod = false, serialWidth = 3 } = opts;

	// Validate inputs
	const field = zField.parse(c.field);
	const year = z.number().int().min(1).max(4).parse(c.year) as YearCode; // Simple validation
	const attribute = zAttribute.parse(c.attribute);
	const method = z.number().int().min(1).max(4).parse(c.method);
	const term = zTermCode.parse(c.term);
	const serial = z.number().int().min(0).max(999).parse(c.serial);

	const serialStr = pad(serial, serialWidth);

	if (combineAttrAndMethod) {
		// 5分割
		return [field, year, `${attribute}${method}`, term, serialStr].join("-");
	}
	// 6分割
	return [field, year, attribute, method, term, serialStr].join("-");
}

// // ---------- Description Helper ----------

// // The original TERM object was missing, so we can't look up a label for term easily unless we define it or just use the code.
// // The task "test expects labels to have term key".
// // In the test: `term: "1030"` so it just uses the code itself as the label.
// // That simplifies things.

function displayedYear(y: number): string {
	return YEAR[y as YearCode] || `${y}年次`;
}

// Re-export constants if needed by other files, though usually only Parsing results are needed.
