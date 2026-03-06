import { useVirtualizer } from "@tanstack/react-virtual";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { type subjectCategories, TeachingMethod } from "@/lib/syllabusConsts";
import { parseQuarter, syllabusUrl } from "@/lib/utils";
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
	teachingMethod,
	setCart,
}: {
	subjects: Subject[];
	cart: Subject[];
	attainments: Attainment[];
	category: (typeof subjectCategories)[number]["id"][];
	year: number;
	quarter: 1 | 2 | 3 | 4;
	keyword: string;
	teachingMethod: (keyof typeof TeachingMethod)[];
	setCart: (cart: Subject[]) => void;
}) {
	const [filterThisQuarter, setFilterThisQuarter] = useState(true);
	const [compactView, setCompactView] = useState(false);
	const parentRef = useRef<HTMLDivElement>(null);
	const [containerWidth, setContainerWidth] = useState(0);

	useEffect(() => {
		if (!parentRef.current) return;
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setContainerWidth(entry.contentRect.width);
			}
		});

		resizeObserver.observe(parentRef.current);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

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
								parseQuarter(e)?.includes(quarter),
							),
					)
					.filter(
						(s) =>
							!attainments.find(
								(a) =>
									a.subject?.numbering === s.numbering && a.credits !== null,
							),
					)
					.filter((s) => !cart.find((c) => c.numbering === s.numbering))
					.filter((s) => {
						return [
							s.name,
							s.description,
							...s.tags.map((t) => t.name),
							...s.faculty.map((f) => f.name),
						]
							.join(" ")
							.toLocaleLowerCase()
							.includes(keyword.toLowerCase());
					})
					.filter((s) => {
						if (teachingMethod.length === 0) return true;
						const methods = teachingMethod.map((m) => TeachingMethod[m]);
						return methods.includes(s.metadata.teachingMethod);
					})
			: [];
	}, [
		category,
		subjects,
		attainments,
		year,
		quarter,
		cart,
		keyword,
		teachingMethod,
		filterThisQuarter,
	]);

	const columnWidth = 224; // w-56
	const gap = 16; // gap-4
	const columns = compactView
		? Math.max(1, Math.floor((containerWidth + gap) / (columnWidth + gap)))
		: 1;

	const rowVirtualizer = useVirtualizer({
		count: Math.ceil(filterdSubjects.length / columns),
		getScrollElement: () => parentRef.current,
		estimateSize: () => (compactView ? 140 : 200), // Adjusted estimation
		overscan: 5,
	});

	return (
		<Card className="h-full">
			<CardHeader>
				<div className="flex justify-between items-center w-full">
					<div className="flex-1 text-sm text-gray-500">
						クリックで追加・削除 右クリックでメニュー
					</div>
					<div className="text-center">
						<CardTitle>科目検索</CardTitle>
						<CardDescription className="flex gap-2 justify-between w-32">
							<span>
								{filterThisQuarter ? `${year}年度 ${quarter}Q` : "全期"}
							</span>
							<span>{filterdSubjects.length}件</span>
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
			<CardContent
				ref={parentRef}
				className="h-full px-4 overflow-auto scroll-contain"
			>
				{subjects.length === 0 ? (
					<div className="flex flex-wrap gap-4">
						{Array.from({ length: 10 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Skeletons are static and won't change, so using index as key is acceptable here.
							<Skeleton className="w-full h-64 rounded-2xl" key={i} />
						))}
					</div>
				) : (
					<div
						style={{
							height: `${rowVirtualizer.getTotalSize()}px`,
							width: "100%",
							position: "relative",
						}}
					>
						{rowVirtualizer.getVirtualItems().map((virtualRow) => {
							const rowStartIndex = virtualRow.index * columns;
							const rowItems = filterdSubjects.slice(
								rowStartIndex,
								rowStartIndex + columns,
							);

							return (
								<div
									key={virtualRow.key}
									data-index={virtualRow.index}
									ref={rowVirtualizer.measureElement}
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										width: "100%",
										transform: `translateY(${virtualRow.start}px)`,
									}}
									className="flex gap-4"
								>
									{rowItems.map((subject) => {
										if (compactView) {
											return (
												<motion.div
													key={subject.numbering}
													layoutId={subject.numbering}
													layoutScroll
													style={{ width: columnWidth }}
												>
													<Tooltip>
														<TooltipTrigger className="w-full">
															<ContextMenu>
																<ContextMenuTrigger>
																	<button
																		type="button"
																		className="w-full rounded-2xl overflow-hidden hover:scale-105 hover:shadow-blue-300/50 hover:shadow-md transition-all duration-200"
																		onClick={() => {
																			!cart.find(
																				(c) =>
																					c.numbering === subject.numbering,
																			) && setCart([subject, ...cart]);
																		}}
																	>
																		<motion.img
																			layout
																			src={subject.thumbnailUrl}
																			alt={subject.name}
																			className="w-full h-auto object-cover aspect-[calc(1200/675)]"
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
																				(c) =>
																					c.numbering === subject.numbering,
																			) && setCart([subject, ...cart]);
																		}}
																	>
																		追加
																		<ContextMenuShortcut>
																			Enter
																		</ContextMenuShortcut>
																	</ContextMenuItem>
																	<ContextMenuItem
																		onSelect={() => {
																			window.open(
																				syllabusUrl(subject),
																				"_blank",
																			);
																		}}
																	>
																		シラバスを開く
																		<ContextMenuShortcut>
																			Ctrl+Open
																		</ContextMenuShortcut>
																	</ContextMenuItem>
																</ContextMenuContent>
															</ContextMenu>
														</TooltipTrigger>
														<TooltipContent className="max-w-xs">
															{subject.name} をカートに追加
														</TooltipContent>
													</Tooltip>
												</motion.div>
											);
										}

										// Normal View
										return (
											<motion.div
												key={subject.numbering}
												layoutId={subject.numbering}
												layoutScroll
												className="flex flex-col sm:flex-row gap-2 w-full hover:shadow-blue-300/50 hover:shadow-md rounded-2xl transition-shadow duration-200 cursor-pointer mb-4"
												onClick={() => {
													!cart.find(
														(c) => c.numbering === subject.numbering,
													) && setCart([subject, ...cart]);
												}}
											>
												<ContextMenu>
													<ContextMenuTrigger className="flex-1 min-w-0">
														<SubjectCard subject={subject} />
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
															<ContextMenuShortcut>
																Ctrl+Open
															</ContextMenuShortcut>
														</ContextMenuItem>
													</ContextMenuContent>
												</ContextMenu>
											</motion.div>
										);
									})}
								</div>
							);
						})}
					</div>
				)}
				{subjects.length === 0 && "No Subjects! ;)"}
			</CardContent>
		</Card>
	);
}
