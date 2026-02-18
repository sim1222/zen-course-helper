import { useMemo } from "react";
import {
	BsCalendarEvent,
	BsClock,
	BsMortarboard,
	BsUiRadiosGrid,
} from "react-icons/bs";
import { FieldColors } from "@/lib/colors";
import { parseCourseCode } from "@/lib/numberingParser";
import { cn, parseQuarter, syllabusUrl } from "@/lib/utils";
import type { Subject } from "@/types/apiTypes";
import FacultyBadge from "./FacultyBadge";
import LinkToExternal from "./LinkToExternal";
import { QuarterIndicator } from "./QuarterIndicator";
import TagBadge from "./TagBadge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

export default function SubjectCard(props: {
	subject: Subject;
	className?: string;
}) {
	const { subject } = props;
	const parsedNumbering = useMemo(() => {
		return parseCourseCode(subject.numbering);
	}, [subject.numbering]);
	const parsedQuarters = useMemo(() => {
		const quarters = parseQuarter(subject.metadata.quarters);
		return quarters ? quarters : [];
	}, [subject.metadata.quarters]);

	return (
		<Card className={props.className}>
			<CardHeader className="flex">
				<div className="mr-4 basis-1/3 shrink min-w-52 max-w-64">
					<img
						src={subject.thumbnailUrl}
						alt={subject.name}
						className="rounded-2xl aspect-[calc(1200/675)] w-full object-cover basis-1/3 shrink "
					/>
				</div>
				<div className="text-start basis-2/3 grow">
					<CardTitle className="text-lg text-blue-900 flex items-center gap-1">
						<span
							className={cn(
								"px-1 py-0.5 rounded text-sm font-medium",
								FieldColors[parsedNumbering.field],
							)}
						>
							{parsedNumbering.labels.field}
						</span>
						{subject.name}
					</CardTitle>
					<CardDescription className="line-clamp-3">
						{subject.description}
					</CardDescription>
					<div className="mt-2 gap-1 flex">
						<div className="flex items-center gap-1">
							<BsMortarboard className="text-gray-500" />
							<span>{subject.metadata.credit}</span>
						</div>
						<Separator orientation="vertical" className="h-full" />
						<div className="flex items-center gap-1">
							<BsClock className="text-gray-500" />
							<QuarterIndicator values={new Set(parsedQuarters)} />
						</div>
						<Separator orientation="vertical" className="h-full" />
						<div className="flex items-center gap-1">
							<BsCalendarEvent className="text-gray-500" />
							<span>{subject.openingYear}年度</span>
						</div>
						<Separator orientation="vertical" className="h-full" />
						{/* <div className="flex items-center gap-1">
							<BsUiRadiosGrid className="text-gray-500" />
							<span>{subject.metadata.teachingMethod}</span>
						</div>
						<Separator orientation="vertical" className="h-full" /> */}
						<LinkToExternal href={syllabusUrl(subject)}>
							シラバスを開く
						</LinkToExternal>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex flex-wrap gap-2">
				{subject.faculty.map((faculty) => (
					<FacultyBadge key={faculty.id} faculty={faculty} />
				))}
			</CardContent>
			<CardFooter className="flex flex-wrap gap-2">
				{subject.tags.map((tag) => (
					<TagBadge key={tag.id} tag={tag} />
				))}
			</CardFooter>
		</Card>
	);
}
