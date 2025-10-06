import { useMemo, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { parseCoursesFromText } from "@/lib/textParser";
import {
	type Attainment,
	useAttainmentsStore,
} from "@/stores/attainmentsStore";
import { useSubjectsStore } from "@/stores/subjectsStore";
import type { Subject } from "@/types/apiTypes";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useCartStore } from "@/stores/cartStore";

function convertToAttainment(
	subjects: Subject[],
	courses: ReturnType<typeof parseCoursesFromText>["courses"],
): Attainment[] {
	const attainments = courses.map((course) => {
		const subject = subjects.find((s) => s.name === course.name)
		return {
			subject: subject ?? null,
			...course,
		};
	});
	return attainments;
}

export default function TranscriptParse({
	setDialogOpen,
}: {
	setDialogOpen: (open: boolean) => void;
}) {
	const [value, setValue] = useState("");

	const attainmentsStore = useAttainmentsStore();
	const subjectsStore = useSubjectsStore();
	const cartStore = useCartStore();

	const parsed = useMemo(() => {
		return parseCoursesFromText(value);
	}, [value]);

	const attainments = useMemo(() => {
		return convertToAttainment(subjectsStore.subjects, parsed.courses.filter(c => !c.isCurrent));
	}, [parsed, subjectsStore.subjects]);
	const currentAttainments = useMemo(() => {
		return convertToAttainment(subjectsStore.subjects, parsed.courses.filter(c => c.isCurrent));
	}, [parsed, subjectsStore.subjects]);

	return (
		<div className="w-full overflow-auto flex flex-col gap-4">
			<Textarea
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onBlur={(e) => {
					e.target.setSelectionRange(parsed.start ?? 0, parsed.start ?? 0 + 10);
					console.log(parsed.start);
				}}
				placeholder="ここに成績照会の内容を貼り付けてください"
				className="w-full h-24"
			/>
			<div className="max-h-[400px] overflow-auto border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-8">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									className="bi bi-check"
									viewBox="0 0 16 16"
								>
									<title>check</title>
									<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
								</svg>
							</TableHead>
							<TableHead className="w-[100px]">科目</TableHead>
							<TableHead className="text-right">単位数</TableHead>
							<TableHead className="text-center">評価</TableHead>
							<TableHead className="text-center">GPA対象</TableHead>
							<TableHead>教員氏名</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{attainments.map((course, index) => (
							<TableRow key={index}>
								<TableCell>
									{course.subject ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											className="bi bi-check"
											viewBox="0 0 16 16"
										>
											<title>check</title>
											<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
										</svg>
									) : (
										""
									)}
								</TableCell>
								<TableCell className="font-medium">
									{course.subject?.name ?? course.name}
								</TableCell>
								<TableCell className="text-right">
									{course.credits ?? "-"}
								</TableCell>
								<TableCell className="text-center">{course.grade}</TableCell>
								<TableCell className="text-center">
									{course.isIncludeInGPA ? "Yes" : "No"}
								</TableCell>
								<TableCell className="truncate">
									{course.subject?.faculty.map((f) => f.name).join(", ") ??
										course.teacher}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<Button
				className="place-self-end"
				onClick={() => {
					attainmentsStore.setAttainments(attainments);
					cartStore.addSubjects(currentAttainments.filter((a) => a.subject !== null).map((a) => a.subject).filter((s): s is Subject => s !== null));
					setDialogOpen(false);
				}}
				disabled={
					parsed.courses.length === 0 || subjectsStore.subjects.length === 0
				}
			>
				インポート
			</Button>
		</div>
	);
}
