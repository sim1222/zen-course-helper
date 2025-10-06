import { syllabusUrl } from "@/lib/utils";
import type { Subject } from "@/types/apiTypes";
import FacultyBadge from "./FacultyBadge";
import LinkToExternal from "./LinkToExternal";
import TagBadge from "./TagBadge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";

export default function SubjectCard(props: {
	subject: Subject;
	className?: string;
}) {
	const { subject } = props;
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
					<CardTitle className="text-lg text-blue-900">
						{subject.name}
					</CardTitle>
					<CardDescription className="line-clamp-3">
						{subject.description}
					</CardDescription>
					<div className="mt-2 gap-1 flex">
						<span className="">
							{subject.numbering.startsWith("BSC") ? "基礎" : "展開"}
						</span>
						<span>{subject.metadata.credit}</span>
						<span>{subject.metadata.quarters.join(", ")}</span>
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
