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
import { syllabusUrl } from "@/lib/utils";
import type { Subject } from "@/types/apiTypes";
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
		<Card className="h-[calc(100%-32px)]">
			<CardHeader>
				<CardTitle>
					カート{subjects.length > 0 ? ` (${subjects.length})` : ""}
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
													setCart((oldCart) =>
														oldCart.filter(
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
													<span>{subject.metadata.quarters}</span>
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
													setCart((oldCart) =>
														oldCart.filter(
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
							<DialogTitle>登録内容</DialogTitle>
						</DialogHeader>
						{Object.entries(
							Object.groupBy(
								subjects.filter(
									(s) => s.metadata.teachingMethod !== "ライブ映像科目",
								),
								(s) => s.openingYear,
							),
						).map(([year, subjectsInYear]) => (
							<div key={year} className="mb-4 w-full">
								{Object.entries(
									Object.groupBy(subjectsInYear ?? [], (s) =>
										s.metadata.quarters.join(", "),
									),
								).map(([quarters, subjectsInQuarter]) => (
									<div key={quarters} className="mb-2 ml-4 ">
										<h3 className="font-semibold text-md mb-1">
											{year}年度 {quarters}
										</h3>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="w-[300px]">授業科目</TableHead>
													<TableHead className="w-[200px] max-w-[200px]">
														教員氏名
													</TableHead>
													<TableHead className="w-[120px]">教室</TableHead>
													<TableHead className="w-[100px] text-right">
														単位数
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{subjectsInQuarter?.map((s) => (
													<TableRow key={s.numbering}>
														<TableCell>{s.name}</TableCell>
														<TableCell className="truncate max-w-[200px]">
															{s.faculty.map((f) => f.name).join(", ")}
														</TableCell>
														<TableCell>
															{s.metadata.teachingMethod.replace("科目", "")}
														</TableCell>
														<TableCell className="text-right">
															{s.metadata.credit.replace("単位", "")}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								))}
							</div>
						))}

						{Object.entries(
							Object.groupBy(
								subjects.filter(
									(s) => s.metadata.teachingMethod === "ライブ映像科目",
								),
								(s) => s.openingYear,
							),
						).map(([year, subjectsInYear]) => (
							<div key={year} className="mb-4">
								{Object.entries(
									Object.groupBy(subjectsInYear ?? [], (s) =>
										s.metadata.quarters.join(", "),
									),
								).map(([quarters, subjectsInQuarter]) => (
									<div key={quarters} className="mb-2 ml-4">
										<h3 className="font-semibold text-md mb-1">
											{year}年度 {quarters}（ライブ映像科目）
										</h3>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="w-[300px]">授業科目</TableHead>
													<TableHead>教員氏名</TableHead>
													<TableHead className="text-right">単位数</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{subjectsInQuarter?.map((s) => (
													<TableRow key={s.numbering}>
														<TableCell>{s.name}</TableCell>
														<TableCell className="truncate max-w-[200px]">
															{s.faculty.map((f) => f.name).join(", ")}
														</TableCell>
														<TableCell className="text-right">
															{s.metadata.credit}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
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
