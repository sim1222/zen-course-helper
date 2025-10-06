// parser-zod.ts
import { z } from "zod";

export const CourseSchema = z.object({
	name: z.string().min(1),
	credits: z.number().nullable(), // ← null 許容（厳密にしたいなら .nullable() を外す）
	grade: z.string().default(""),
	isIncludeInGPA: z.boolean(),
	teacher: z.string().default(""),
});
export type Course = z.infer<typeof CourseSchema>;

export type ParseOptions = {
	/** 見出し語のカスタム除外（必要に応じて追加） */
	extraSectionLabels?: string[];
};

const DEFAULT_SECTION_LABELS = new Set([
	"科目",
	"導入",
	"導入科目",
	"基礎科目",
	"展開科目",
	"世界理解",
	"文化・思想",
	"経済・マーケット",
	"社会接続",
	"基盤リテラシー",
	"情報",
	"数理",
]);

const ZENKAKU = "０１２３４５６７８９．，－＋";
const HANKAKU = "0123456789.,-+";
const TERMINATION_NOTICE =
	"(注)科目名の先頭に※が出力された科目は現在履修中です。";

function z2hDigits(s: string): string {
	return s.replace(/[０-９．，－＋]/g, (ch) => {
		const i = ZENKAKU.indexOf(ch);
		return i >= 0 ? HANKAKU[i] : ch;
	});
}

function parseIntOrNull(s: string | undefined): number | null {
	const t = z2hDigits(String(s ?? ""))
		.replace(/,/g, "")
		.trim();
	if (!t) return null;
	const n = Number(t);
	return Number.isFinite(n) ? n : null;
}

function gpaMarkToBool(s: string | undefined): boolean {
	const t = (s ?? "").trim();
	return /[○]/.test(t) || /対象/.test(t);
}

const GRADE_CANDIDATES = new Set<string>([
	..."ABCDEFG",
	"W", // 履修取消
	"認", // 認定
	"P", // Pixiv 合格
	"Fd", // Pixiv 不合格
]);

function isTermHeader(s: string): boolean {
	// 例: 2025年度2Q / 2024年度1Q など
	return /^\d{4}年度[1-4]Q$/.test(s.trim());
}

/**
 * メイン: 貼り付けテキストを配列に変換
 */
export function parseCoursesFromText(
	raw: string,
	opts: ParseOptions = {},
): { courses: Course[]; start: number } {
	const sectionLabels = new Set([
		...DEFAULT_SECTION_LABELS,
		...(opts.extraSectionLabels ?? []),
	]);

	const courses: Course[] = [];

	let currentIndex = 0;
	let startIndex = 0;

	for (const [i, rawLine] of raw.split(/\r?\n/).entries()) {
		currentIndex += rawLine.length + 1; // +1 for \n
		const line = rawLine.replace(/\n$/g, "");
		const trimmedLine = line.trim();
		if (!trimmedLine) continue;
		if (trimmedLine === TERMINATION_NOTICE) break;

		// タブ区切り。先頭に空セルが入ることがあるので落とす
		let parts = line.split("\t").map((p) => p.trim());
		if (parts.length && parts[0] === "") parts = parts.slice(1);
		if (!parts.length || !parts[0]) continue;

		const head = parts[0];

		// 学期見出し & セクション見出しを除外
		if (isTermHeader(head)) {
			if (courses.length === 0) {
				startIndex = currentIndex - rawLine.length - 1; // 最初の学期見出しの位置
			}
			continue;
		}
		if (sectionLabels.has(head)) continue;

		// [name, credits, grade, gpaMark, teacher] の5列に合わせてパディング
		const cols = [...parts, "", "", "", "", ""].slice(0, 5);
		const [name, creditsRaw, grade, gpaMark, teacher] = cols;

		// 行フィルタ（科目らしさのヒューリスティック）
		const hasAnySignal = !!grade || !!creditsRaw || !!teacher; // 何かしら値がある
		if (!hasAnySignal) continue;

		const looksLikeGrade =
			!!grade && (GRADE_CANDIDATES.has(grade) || grade.length <= 2); // A/B/C/P/G/認 など

		const looksLikeCredits = parseIntOrNull(creditsRaw) !== null;

		if (!(looksLikeGrade || looksLikeCredits || teacher)) {
			// どれにも当てはまらなければスキップ（見出しの取りこぼし対策）
			continue;
		}

		courses.push({
			name,
			credits: parseIntOrNull(creditsRaw),
			grade: grade || "",
			isIncludeInGPA: gpaMarkToBool(gpaMark),
			teacher: teacher || "",
		});
	}

	const parsed = CourseSchema.array().safeParse(courses);
	if (!parsed.success) {
		console.warn("Some rows are invalid:", parsed.error.flatten());
		throw new Error("Some rows are invalid");
	}

	return { courses: parsed.data, start: startIndex };
}

/**
 * 厳密型（credits: number）の配列が欲しい場合はこれを使う
 * - credits が null の行をドロップ
 */
export function toStrictCourses(
	rows: Course[],
): Array<Omit<Course, "credits"> & { credits: number }> {
	return rows.filter(
		(r): r is Omit<Course, "credits"> & { credits: number } =>
			r.credits !== null,
	);
}
