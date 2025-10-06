import z from "zod";

// ---------- 定義 / マスタ ----------
export enum FIELD {
	INT = "導入科目",
	BSC = "基礎科目",
	INF = "情報",
	MTH = "数理",
	LAN = "多言語情報理解",
	HUM = "文化・思想",
	SOC = "社会・ネットワーク",
	ECON = "経済・マーケット",
	DIGI = "デジタル産業",
	CAR = "社会接続",
	OPT = "自由",
	PRJ = "卒業プロジェクト",
}
export type FieldCode = keyof typeof FIELD;

export type YearCode = 1 | 2 | 3 | 4;

export enum ATTRIBUTE {
	A = "必修",
	B = "選択必修",
	C = "選択",
	D = "自由",
}
export type AttributeCode = keyof typeof ATTRIBUTE;

export const METHOD = {
	1: "オンデマンド",
	2: "ライブ映像",
	3: "演習",
	4: "ゼミ",
} as const;
export type MethodCode = keyof typeof METHOD;

type Quarter = 1 | 2 | 3 | 4;
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

const zField = z.nativeEnum;
const zYear = z.enum(YEAR_CODES, { message: "year が不正です" });
const zAttribute = z.enum(ATTRIBUTE_CODES, { message: "attribute が不正です" });
const zMethod = z.enum(METHOD_CODES, { message: "method が不正です" });

// ---------- 型 ----------
export type SerialNumber = number; // 1〜999 を想定

export interface CourseNumber {
	field: FieldCode; // ①
	year: YearCode; // ②
	attribute: AttributeCode; // ③
	method: MethodCode; // ④
	term: TermCode; // ⑤
	serial: SerialNumber; // ⑥ (数値で保持、出力時にゼロ埋め)
}

export interface ParsedCourseNumber extends CourseNumber {
	// ラベル（日本語名）も同梱
	labels: {
		field: string;
		year: string;
		attribute: string;
		method: string;
		term: string;
	};
	// 元文字列
	source: string;
	// 5分割 or 6分割のどちらで解釈したか
	normalizedFormat: "5-part" | "6-part";
}

// ---------- ユーティリティ ----------
const isField = (v: string): v is FieldCode => v in FIELD;
const isYear = (v: string): v is YearCode => v in YEAR;
const isAttribute = (v: string): v is AttributeCode => v in ATTRIBUTE;
const isMethod = (v: string): v is MethodCode => v in METHOD;
const isTerm = (v: string): v is TermCode => v in TERM;

const pad = (n: number, width = 3) => n.toString().padStart(width, "0");

function expect<T extends string>(
	guard: (v: string) => v is T,
	value: string,
	what: string,
): T {
	if (!guard(value)) {
		throw new Error(`Invalid ${what}: "${value}"`);
	}
	return value;
}

function parseSerial(s: string): number {
	if (!/^\d{1,3}$/.test(s)) {
		throw new Error(`Invalid serial (must be 1〜3桁の数字): "${s}"`);
	}
	const n = parseInt(s, 10);
	if (n < 0 || n > 999) {
		throw new Error(`Invalid serial range (0〜999): "${s}"`);
	}
	return n;
}

// ---------- パーサー ----------
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

	const [p1, p2, p3, p4, p5, p6] =
		parts.length === 6
			? parts
			: [parts[0], parts[1], "", parts[2], parts[3], parts[4]];

	const field = expect(isField, p1, "field");
	const year = expect(isYear, p2, "year");

	let attribute: AttributeCode;
	let method: MethodCode;

	if (parts.length === 6) {
		attribute = expect(isAttribute, p3, "attribute");
		method = expect(isMethod, p4, "method");
	} else {
		// 5分割: p3は空。p4が "B1" などの複合。
		const m = /^([A-D])([1-4])$/.exec(p4);
		if (!m) throw new Error(`Invalid combined attribute/method: "${p4}"`);
		attribute = expect(isAttribute, m[1], "attribute");
		method = expect(isMethod, m[2], "method");
	}

	const term = expect(isTerm, p5, "term");
	const serial = parseSerial(p6);

	const parsed: ParsedCourseNumber = {
		field,
		year,
		attribute,
		method,
		term,
		serial,
		labels: {
			field: FIELD[field],
			year: YEAR[year],
			attribute: ATTRIBUTE[attribute],
			method: METHOD[method],
			term: TERM[term],
		},
		source: code,
		normalizedFormat: parts.length === 6 ? "6-part" : "5-part",
	};
	return parsed;
}

// ---------- ビルダー ----------
export interface BuildOptions {
	/** デフォルト: false（6分割）。true の場合は ③+④ を結合して 5分割を出力 */
	combineAttrAndMethod?: boolean;
	/** 連番のゼロ埋め桁数。デフォルト 3（例: 1 -> 001） */
	serialWidth?: number;
}

export function buildCourseCode(
	c: CourseNumber,
	opts: BuildOptions = {},
): string {
	const { combineAttrAndMethod = false, serialWidth = 3 } = opts;

	// validate (使い手が型を破った場合に備えて)
	expect(isField, c.field, "field");
	expect(isYear, c.year, "year");
	expect(isAttribute, c.attribute, "attribute");
	expect(isMethod, c.method, "method");
	expect(isTerm, c.term, "term");
	if (!Number.isInteger(c.serial) || c.serial < 0 || c.serial > 999) {
		throw new Error(`Invalid serial range (0〜999): "${c.serial}"`);
	}

	const serial = pad(c.serial, serialWidth);

	if (combineAttrAndMethod) {
		// 5分割
		return [c.field, c.year, `${c.attribute}${c.method}`, c.term, serial].join(
			"-",
		);
	}
	// 6分割
	return [c.field, c.year, c.attribute, c.method, c.term, serial].join("-");
}

// ---------- おまけ：説明テキスト ----------
export function describeCourseNumber(code: string): string {
	const p = parseCourseCode(code);
	return [
		`学問分野/科目分類: ${p.field}（${p.labels.field}）`,
		`履修想定年次: ${p.year}（${p.labels.year}）`,
		`科目属性: ${p.attribute}（${p.labels.attribute}）`,
		`授業の方法: ${p.method}（${p.labels.method}）`,
		`開講の時期: ${p.term}（${p.labels.term}）`,
		`連番: ${pad(p.serial)}`,
	].join("\n");
}

// ---------- 使用例 ----------
/*
const a = parseCourseCode("INT-1-A-1-1030-001");
console.log(a);

const b = parseCourseCode("BSC-1-B1-1030-001");
console.log(b);

const code6 = buildCourseCode(
  { field: "BSC", year: "1", attribute: "B", method: "1", term: "1030", serial: 1 },
  { combineAttrAndMethod: false }
); // "BSC-1-B-1-1030-001"

const code5 = buildCourseCode(
  { field: "BSC", year: "1", attribute: "B", method: "1", term: "1030", serial: 1 },
  { combineAttrAndMethod: true }
); // "BSC-1-B1-1030-001"

console.log(describeCourseNumber("BSC-1-B1-1030-001"));
*/
