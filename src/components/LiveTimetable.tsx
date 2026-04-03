import { useMemo } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Subject } from "@/types/apiTypes";

const DAYS = ["月", "火", "水", "木", "金"] as const;
// getDay() returns 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri
const DAY_INDICES = [1, 2, 3, 4, 5] as const;

function parseCourseDate(
	value: string,
): { dayIndex: (typeof DAY_INDICES)[number]; period: number } | null {
	// "2026/04/20 / 2限(11:15-12:45)"
	const match = value.match(/(\d{4})\/(\d{2})\/(\d{2})\s*\/\s*(\d+)限/);
	if (!match) return null;
	const date = new Date(`${match[1]}-${match[2]}-${match[3]}`);
	const dayIndex = date.getDay();
	if (dayIndex < 1 || dayIndex > 5) return null;
	const period = parseInt(match[4], 10);
	if (Number.isNaN(period) || period < 1 || period > 7) return null;
	return { dayIndex: dayIndex as (typeof DAY_INDICES)[number], period };
}

function getSubjectSlot(
	subject: Subject,
): { dayIndex: (typeof DAY_INDICES)[number]; period: number } | null {
	const counts = new Map<string, number>();
	const slots = new Map<
		string,
		{ dayIndex: (typeof DAY_INDICES)[number]; period: number }
	>();

	for (const plan of subject.coursePlans) {
		if (!plan.date) {
			console.debug(`[LiveTimetable] ${subject.name}: plan.date is undefined`);
			continue;
		}
		const parsed = parseCourseDate(plan.date.value);
		console.debug(
			`[LiveTimetable] ${subject.name}: date.value="${plan.date.value}" =>`,
			parsed ?? "parse failed",
		);
		if (!parsed) continue;
		const key = `${parsed.dayIndex}-${parsed.period}`;
		counts.set(key, (counts.get(key) ?? 0) + 1);
		slots.set(key, parsed);
	}

	if (counts.size === 0) return null;
	const topKey = [...counts.entries()].reduce((a, b) =>
		a[1] >= b[1] ? a : b,
	)[0];
	return slots.get(topKey) ?? null;
}

export function LiveTimetable({ subjects }: { subjects: Subject[] }) {
	const { timetable, noSlot } = useMemo(() => {
		const timetable = new Map<number, Map<number, Subject[]>>();
		const noSlot: Subject[] = [];
		for (const subject of subjects) {
			const slot = getSubjectSlot(subject);
			if (!slot) {
				noSlot.push(subject);
				continue;
			}
			if (!timetable.has(slot.period)) timetable.set(slot.period, new Map());
			const periodMap =
				timetable.get(slot.period) ?? new Map<number, Subject[]>();
			timetable.set(slot.period, periodMap);
			const daySubjects = periodMap.get(slot.dayIndex) ?? [];
			periodMap.set(slot.dayIndex, [...daySubjects, subject]);
		}
		return { timetable, noSlot };
	}, [subjects]);

	const maxPeriod = timetable.size > 0 ? Math.max(...timetable.keys()) : 0;
	const periods = Array.from({ length: maxPeriod }, (_, i) => i + 1);

	return (
		<div>
			{timetable.size > 0 && (
				<table className="w-full table-fixed border-collapse text-sm">
					<colgroup>
						<col className="w-8" />
						{DAYS.map((day) => (
							<col key={day} className="w-1/5" />
						))}
					</colgroup>
					<thead>
						<tr className="bg-[#1a5276] text-white">
							<th className="border border-[#1a5276]" />
							{DAYS.map((day) => (
								<th
									key={day}
									className="border border-[#1a5276] py-1 px-2 text-center"
								>
									{day}曜日
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{periods.map((period) => (
							<tr key={period}>
								<td className="border border-gray-300 text-center font-medium text-[#1a5276] bg-[#eaf2f8]">
									{period}
								</td>
								{DAY_INDICES.map((dayIdx) => {
									const cellSubjects = timetable.get(period)?.get(dayIdx) ?? [];
									return (
										<td
											key={dayIdx}
											className="border border-gray-300 p-1 align-top min-h-[60px]"
										>
											{cellSubjects.map((s) => (
												<div key={s.numbering}>
													<p className="leading-snug font-bold">{s.name}</p>
													<p className="text-xs text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap max-w-48">
														{s.faculty.map((f) => f.name).join(", ")}
													</p>
													<p className="text-xs text-gray-500">
														{s.metadata.credit}
													</p>
												</div>
											))}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			)}
			{noSlot.length > 0 && (
				<div className="mt-2">
					{timetable.size > 0 && (
						<p className="text-xs text-gray-500 mb-1">
							時間割に表示できない科目
						</p>
					)}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[300px]">授業科目</TableHead>
								<TableHead className="w-[200px] max-w-[200px]">
									教員氏名
								</TableHead>
								<TableHead className="w-[100px] text-right">単位数</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{noSlot.map((s) => (
								<TableRow key={s.numbering}>
									<TableCell>{s.name}</TableCell>
									<TableCell className="truncate max-w-[200px]">
										{s.faculty.map((f) => f.name).join(", ")}
									</TableCell>
									<TableCell className="text-right">
										{s.metadata.credit.replace("単位", "")}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
