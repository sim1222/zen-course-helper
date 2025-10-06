import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Quarter, type subjectCategories } from "@/lib/syllabusConsts";
import { syllabusUrl } from "@/lib/utils";
import type { Attainment } from "@/stores/attainmentsStore";
import type { Subject } from "@/types/apiTypes";
import SubjectCard from "./SubjectCard";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Toggle } from "./ui/toggle";

export default function SubjectChooser({
	subjects,
	cart,
	attainments,
	category,
	year,
	quarter,
	keyword,
	setCart,
}: {
	subjects: Subject[];
	cart: Subject[];
	attainments: Attainment[];
	category: (typeof subjectCategories)[number]["id"][];
	year: number;
	quarter: 1 | 2 | 3 | 4;
	keyword: string;
	setCart: (cart: Subject[]) => void;
}) {
	const [filterThisQuarter, setFilterThisQuarter] = useState(true);
	const [compactView, setCompactView] = useState(false);

	const parsedQuarter = useMemo(() => {
		return Object.entries(Quarter)
			.filter((q) => q[0].includes(quarter.toString()))
			.map((e) => e[1]) as (typeof Quarter)[keyof typeof Quarter][];
	}, [quarter]);

	const filterdSubjects = useMemo(() => {
		return category
			? subjects
					.filter(
						(s) =>
							category.length === 0 ||
							s.subjectCategoryIds.some((c) => category.includes(c)),
					)
					.filter(
						(s) => !filterThisQuarter || s.openingYear === year.toString(),
					)
					.filter(
						(s) =>
							!filterThisQuarter ||
							s.metadata.quarters.some((e) =>
								parsedQuarter.includes(
									e as (typeof Quarter)[keyof typeof Quarter],
								),
							),
					)
					.filter(
						(s) =>
							!attainments.find((a) => a.subject?.numbering === s.numbering),
					)
					.filter((s) => !cart.find((c) => c.numbering === s.numbering))
					.filter((s) => s.name.includes(keyword))
			: [];
	}, [
		category,
		subjects,
		attainments,
		parsedQuarter,
		year,
		cart,
		keyword,
		filterThisQuarter,
	]);
	return (
		<Card className="h-[calc(100%-32px)]">
			<CardHeader>
				<div className="flex justify-between items-center w-full">
					<div className="flex-1 text-sm text-gray-500">
						クリックで追加・削除 右クリックでメニュー
					</div>
					<div className="text-center">
						<CardTitle>科目検索</CardTitle>
						<CardDescription>
							{filterThisQuarter ? parsedQuarter.join(", ") : "全期"}{" "}
							{filterdSubjects.length}件
						</CardDescription>
					</div>
					<div className="flex-1 flex justify-end items-center">
						<div className="flex items-center">
							<Toggle
								value={filterThisQuarter}
								setValue={setFilterThisQuarter}
							/>
							<span className="ml-2">今Qのみ</span>
						</div>
						<div className="ml-4 flex items-center">
							<Toggle value={compactView} setValue={setCompactView} />
							<span className="ml-2">コンパクト表示</span>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="h-full p-0 pb-16 overflow-auto">
				<div className="flex flex-wrap gap-4 p-4">
					{subjects.length === 0 &&
						Array.from({ length: 10 }).map((_, i) => (
							<Skeleton className="w-full h-64 rounded-2xl" key={i} />
						))}
					{compactView
						? filterdSubjects.map((subject) => (
								<motion.div
									key={subject.numbering}
									layoutId={subject.numbering}
									layoutScroll
								>
									<Tooltip>
										<TooltipTrigger>
											<ContextMenu>
												<ContextMenuTrigger>
													<button
														type="button"
														key={subject.numbering}
														className="rounded-2xl overflow-hidden hover:scale-105 hover:shadow-blue-300/50 hover:shadow-md transition-all duration-200"
														onClick={() => {
															!cart.find(
																(c) => c.numbering === subject.numbering,
															) && setCart([subject, ...cart]);
														}}
													>
														<motion.img
															layout
															src={subject.thumbnailUrl}
															alt={subject.name}
															className="w-56 h-auto"
														/>
													</button>
												</ContextMenuTrigger>
												<ContextMenuContent>
													<ContextMenuLabel>
														{subject.name} ({subject.numbering})
													</ContextMenuLabel>
													<ContextMenuSeparator />
													<ContextMenuItem
														onSelect={() => {
															!cart.find(
																(c) => c.numbering === subject.numbering,
															) && setCart([subject, ...cart]);
														}}
													>
														追加
														<ContextMenuShortcut>Enter</ContextMenuShortcut>
													</ContextMenuItem>
													<ContextMenuItem
														onSelect={() => {
															window.open(syllabusUrl(subject), "_blank");
														}}
													>
														シラバスを開く
														<ContextMenuShortcut>Ctrl+Open</ContextMenuShortcut>
													</ContextMenuItem>
												</ContextMenuContent>
											</ContextMenu>
										</TooltipTrigger>
										<TooltipContent className="max-w-xs">
											{subject.name} をカートに追加
										</TooltipContent>
									</Tooltip>
								</motion.div>
							))
						: filterdSubjects.map((subject) => (
								<motion.div
									key={subject.numbering}
									layoutId={subject.numbering}
									className="flex flex-col sm:flex-row gap-2 w-full hover:shadow-blue-300/50 hover:shadow-md rounded-2xl transition-shadow duration-200 cursor-pointer"
									onClick={() => {
										!cart.find((c) => c.numbering === subject.numbering) &&
											setCart([subject, ...cart]);
									}}
									layoutScroll
								>
									<ContextMenu>
										<ContextMenuTrigger className="flex-1 min-w-0">
											<SubjectCard subject={subject} key={subject.numbering} />
										</ContextMenuTrigger>
										<ContextMenuContent>
											<ContextMenuLabel>
												{subject.name} ({subject.numbering})
											</ContextMenuLabel>
											<ContextMenuSeparator />
											<ContextMenuItem
												onSelect={() => {
													!cart.find(
														(c) => c.numbering === subject.numbering,
													) && setCart([subject, ...cart]);
												}}
											>
												追加
												<ContextMenuShortcut>Enter</ContextMenuShortcut>
											</ContextMenuItem>
											<ContextMenuItem
												onSelect={() => {
													window.open(syllabusUrl(subject), "_blank");
												}}
											>
												シラバスを開く
												<ContextMenuShortcut>Ctrl+Open</ContextMenuShortcut>
											</ContextMenuItem>
										</ContextMenuContent>
									</ContextMenu>
								</motion.div>
							))}
				</div>
				{subjects.length === 0 && "No Subjects! ;)"}
			</CardContent>
		</Card>
	);
}
