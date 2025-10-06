import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getQuarterByFormula } from "@/lib/utils";
import { useAttainmentsStore } from "@/stores/attainmentsStore";
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
	const now = new Date();
	const year = now.getFullYear();
	const quarter = getQuarterByFormula(now);

	const attainmentsStore = useAttainmentsStore();

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
				<div>
					{year}年度 {quarter}Q
				</div>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger>
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
									fill-rule="evenodd"
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
									fill-rule="evenodd"
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
