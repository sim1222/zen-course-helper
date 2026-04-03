import { motion } from "motion/react";
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
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { parseQuarter, syllabusUrl } from "@/lib/utils";
import type { Subject } from "@/types/apiTypes";
import { LiveTimetable } from "./LiveTimetable";
import { QuarterIndicator } from "./QuarterIndicator";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function SubjectCart({
	subjects,
	setCart,
}: {
	subjects: Subject[];
	setCart: (cart: Subject[]) => void;
}) {
	return (
		<Card className="h-full border-0 lg:border lg:h-full">
			<CardHeader>
				<CardTitle>
					カート{subjects.length > 0 ? ` (${subjects.length}科目 ${subjects.reduce((acc, s) => acc + Number(s.metadata.credit.replace("単位", "")), 0)}単位)` : ""}
				</CardTitle>
			</CardHeader>
			<CardContent className="h-full p-2 pb-0 overflow-auto flex flex-col">
				{subjects.length === 0 && (
					<p className="text-gray-600">カートに科目がありません</p>
				)}
				<div className="flex flex-col h-full overflow-y-scroll px-6">
					{subjects.map((subject) => (
						<motion.div
							key={subject.numbering}
							layoutId={subject.numbering}
							layoutScroll
						>
							<Tooltip>
								<TooltipTrigger>
									<ContextMenu>
										<ContextMenuTrigger className="flex-1 min-w-0">
											<Card
												className="py-0 gap-0 hover:brightness-80 active:brightness-50 transition-all duration-200 mb-2 cursor-pointer"
												onClick={() => {
													setCart(
														subjects.filter(
															(s) => s.numbering !== subject.numbering,
														),
													);
												}}
											>
												<div className="flex  rounded-t-sm">
													<img
														src={subject.thumbnailUrl}
														alt={subject.name}
														className="rounded-t-sm"
													/>
												</div>
												<div className="my-1 gap-1 flex justify-center">
													<span className="">
														{subject.numbering.startsWith("BSC")
															? "基礎"
															: "展開"}
													</span>
													<span>{subject.metadata.credit}</span>
													<span>{subject.openingYear}</span>
													<QuarterIndicator
														values={
															new Set(parseQuarter(subject.metadata.quarters))
														}
													/>
												</div>
											</Card>
										</ContextMenuTrigger>
										<ContextMenuContent>
											<ContextMenuLabel>
												{subject.name} ({subject.numbering})
											</ContextMenuLabel>
											<ContextMenuSeparator />
											<ContextMenuItem
												onSelect={() => {
													window.open(syllabusUrl(subject), "_blank");
												}}
											>
												シラバスを開く
												<ContextMenuShortcut>Ctrl+Open</ContextMenuShortcut>
											</ContextMenuItem>
											<ContextMenuSeparator />
											<ContextMenuItem
												onSelect={() => {
													setCart(
														subjects.filter(
															(s) => s.numbering !== subject.numbering,
														),
													);
												}}
												className="text-red-600"
											>
												削除
												<ContextMenuShortcut>Enter</ContextMenuShortcut>
											</ContextMenuItem>
										</ContextMenuContent>
									</ContextMenu>
								</TooltipTrigger>
								<TooltipContent className="max-w-xs">
									{subject.name} をカートから削除
								</TooltipContent>
							</Tooltip>
						</motion.div>
					))}
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<Button
							className="w-full shadow-md shadow-gray-300 mt-auto mb-4"
							disabled={subjects.length === 0}
						>
							チェックアウト
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-4xl">
						<DialogHeader>
							<DialogTitle>登録内容 計 {subjects.reduce((acc, s) => acc + Number(s.metadata.credit.replace("単位", "")), 0)} 単位</DialogTitle>
						</DialogHeader>
						{Object.entries(
							Object.groupBy(subjects, (s) =>
								s.metadata.teachingMethod === "ライブ映像科目"
									? ""
									: s.metadata.quarters.join(", "),
							),
						)
							.sort(([a], [b]) => {
								if (a === "") return 1;
								if (b === "") return -1;
								const firstNum = (s: string) =>
									Number.parseInt(s.match(/\d+/)?.[0] ?? "0", 10);
								return firstNum(a) - firstNum(b);
							})
							.map(([quarters, subjectsInQuarter]) => (
								<div key={quarters} className="mb-4 w-full">
									{Object.entries(
										Object.groupBy(
											subjectsInQuarter ?? [],
											(s) => s.metadata.teachingMethod,
										),
									)
										.map(([teachingMethod, subjectsInMethod]) => (
											<div key={teachingMethod} className="mb-2 ml-4">
												<h3 className="font-semibold text-md mb-1">
													{quarters
														? `${quarters}（${teachingMethod}）`
														: teachingMethod}
												</h3>
												{teachingMethod === "ライブ映像科目" ? (
													<LiveTimetable subjects={subjectsInMethod ?? []} />
												) : (
													<Table>
														<TableHeader>
															<TableRow>
																<TableHead className="w-[300px]">
																	授業科目
																</TableHead>
																<TableHead className="w-[200px] max-w-[200px]">
																	教員氏名
																</TableHead>
																<TableHead className="w-[100px] text-right">
																	単位数
																</TableHead>
															</TableRow>
														</TableHeader>
														<TableBody>
															{subjectsInMethod?.map((s) => (
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
												)}
											</div>
										))}
								</div>
							))}
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	);
}
