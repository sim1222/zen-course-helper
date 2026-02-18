import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Quarter } from "@/lib/numberingParser";
import { cn, getAcademicYearByFormula, getQuarterByFormula } from "@/lib/utils";
import { useAttainmentsStore } from "@/stores/attainmentsStore";
import { useCurrentQuarterStore } from "@/stores/currentQuarterStore";
import { useSubjectsStore } from "@/stores/subjectsStore";
import seisekiImage from "../images/seiseki.png";
import image from "../images/zenportal.png";
import FetchAllSubject from "./FetchAllSubject";
import LinkToExternal from "./LinkToExternal";
import TranscriptParse from "./TranscriptParse";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

export default function Header() {
	const attainmentsStore = useAttainmentsStore();
	const currentQuarterStore = useCurrentQuarterStore();

	const _year = currentQuarterStore.Year;
	const _quarter = currentQuarterStore.Quarter;

	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		setDialogOpen(true);
	}, []);

	return (
		<header className="p-2 flex gap-2 bg-white text-black justify-between sticky top-0 z-10 border-b">
			<nav className="flex flex-row items-center gap-4">
				<div className="px-2 font-bold">
					<Link to="/">ZEN大学 履修登録ヘルパー by sim1222</Link>
				</div>
				<FetchAllSubject />
				<div className="flex gap-2">
					<YearSelector />
					<QuarterSelector />
				</div>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							履修状況を{attainmentsStore.Attainments.length ? "再" : ""}
							インポート
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-auto">
						<DialogHeader>
							<DialogTitle>成績情報をインポート</DialogTitle>
							<DialogDescription>
								PCブラウザで
								<LinkToExternal href="https://portal.zen.ac.jp/uprx/ShibbolethAuthServlet">
									ZEN Portal
								</LinkToExternal>
								を開き、成績→成績照会に行き、Ctrl+Aで全選択、Ctrl+Cでコピーしてから、下のテキストエリアに貼り付けてください。
							</DialogDescription>
						</DialogHeader>
						<div className="flex gap-4 justify-center items-center">
							<img src={seisekiImage} alt="ZEN Portal" className="block h-32" />
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className="bi bi-arrow-right"
								viewBox="0 0 16 16"
							>
								<title>arrow-right</title>
								<path
									fillRule="evenodd"
									d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
								/>
							</svg>
							<p>Ctrl + A</p>
							<img src={image} alt="ZEN Portal" className="block h-32" />
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className="bi bi-arrow-right"
								viewBox="0 0 16 16"
							>
								<title>arrow-right</title>
								<path
									fillRule="evenodd"
									d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
								/>
							</svg>
							<p>Ctrl + C</p>
						</div>
						<TranscriptParse setDialogOpen={setDialogOpen} />
					</DialogContent>
				</Dialog>
			</nav>
			<div className="flex items-center gap-2">
				<LinkToExternal href="https://github.com/sim1222/zen-course-helper">
					GitHub
				</LinkToExternal>
			</div>
		</header>
	);
}

function YearSelector() {
	const currentQuarterStore = useCurrentQuarterStore();
	const subjectsStore = useSubjectsStore();

	const selectableYears = useMemo(() => {
		const years = new Set<number>();
		subjectsStore.subjects.forEach((subject) => {
			years.add(parseInt(subject.openingYear, 10));
		});
		return Array.from(years).sort((a, b) => a - b);
	}, [subjectsStore.subjects]);

	const now = new Date();

	const currentAcademicYear = useMemo(() => {
		return getAcademicYearByFormula(now);
	}, [now]);

	const year = currentQuarterStore.Year;

	return (
		<Select
			value={year.toString()}
			onValueChange={(value) => {
				currentQuarterStore.setYear(parseInt(value, 10));
			}}
		>
			<SelectTrigger className="w-fit">
				<SelectValue />
			</SelectTrigger>
			<SelectContent className="min-w-min">
				{selectableYears.map((year) => (
					<SelectItem
						key={year}
						value={year.toString()}
						className={cn(year === currentAcademicYear ? "underline" : "")}
					>
						{year}年度
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

function QuarterSelector() {
	const currentQuarterStore = useCurrentQuarterStore();

	const now = new Date();

	const current = useMemo(() => {
		return getQuarterByFormula(now);
	}, [now]);

	const quarter = currentQuarterStore.Quarter;

	return (
		<Select
			value={quarter.toString()}
			onValueChange={(value) => {
				currentQuarterStore.setQuarter(parseInt(value, 10) as Quarter);
			}}
		>
			<SelectTrigger className="w-fit">
				<SelectValue />
			</SelectTrigger>
			<SelectContent className="min-w-min">
				{([1, 2, 3, 4] as Quarter[]).map((q) => (
					<SelectItem
						key={q}
						value={q.toString()}
						className={cn(q === current ? "underline" : "")}
					>
						{q}Q
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
