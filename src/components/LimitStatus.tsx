import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { subjectCategories } from "@/lib/syllabusConsts";
import { cn } from "@/lib/utils";
import type { Attainment } from "@/stores/attainmentsStore";
import type { Subject } from "@/types/apiTypes";
import LinkToExternal from "./LinkToExternal";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
} from "./ui/chart";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Toggle } from "./ui/toggle";

/**
 * 本学の卒業要件は、以下のすべての条件を満たしたものとする。
・124単位以上修得すること。
・以下の要件を満たすこと。
1 「導入科目」 「導入科目」から14単位を修得すること。
2 「基礎科目」
以下の要件を満たした上で、「基礎科目」から12単位以上修得すること。
①「数理」「情報」「文化・思想」「社会・ネットワーク」
「経済・マーケット」の定められた科目群のそれぞれから、
２単位以上修得すること。
②「多言語ITコミュニケーション」２単位を修得すること。
3 「展開科目」 以下の要件を満たした上で、「展開科目」から74単位以上修得すること。
3-1 「基盤リテラシー科目」 基盤リテラシー科目から、2.「基礎科目」の履修も合わせ８単位以上修得すること。
3-2 「多言語情報理解科目」 「多言語情報理解科目」から、2.「基礎科目」の履修も合わせ８単位以上修得すること。
3-3 「世界理解科目」
以下の要件を満たした上で、「世界理解科目」から、2.「基礎科目」の履修も合わせ
26単位以上修得すること。
①「デジタル産業」の「IT産業史」「マンガ産業史」
「アニメ産業史」「日本のゲーム産業史」の中から、
２単位以上修得すること。
3-4 「社会接続科目」 「社会接続科目」から卒業要件に算入できる単位数の上限は、10単位までとする。
4 「卒業プロジェクト科目」 「プロジェクト実践」４単位を修得すること。
 */

function CheckMarkLabel(props: { checked: boolean }) {
	return (
		<Label className={cn(props.checked ? "text-green-600" : "text-red-600")}>
			{props.checked ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					className="bi bi-check-circle"
					viewBox="0 0 16 16"
				>
					<title>合格</title>
					<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
					<path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
				</svg>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					className="bi bi-exclamation-triangle"
					viewBox="0 0 16 16"
				>
					<title>不合格</title>
					<path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
					<path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
				</svg>
			)}
		</Label>
	);
}

function ProgressBar(props: {
	value: number;
	max: number;
	title: string;
	color?: string;
	checked?: boolean;
	tooltip?: string;
}) {
	return (
		<div className="w-full">
			<h3>{props.title}</h3>
			<div className="flex items-center gap-2">
				<Progress
					value={(props.value / props.max) * 100}
					className="w-full"
					color={props.color}
				/>
				<Label className="w-6">
					{props.value}/{props.max}
				</Label>
				{props.checked !== undefined &&
					(props.tooltip !== undefined ? (
						<HoverCard>
							<HoverCardTrigger className="cursor-help">
								<CheckMarkLabel checked={props.checked} />
							</HoverCardTrigger>
							<HoverCardContent>{props.tooltip}</HoverCardContent>
						</HoverCard>
					) : (
						<CheckMarkLabel checked={props.checked} />
					))}
			</div>
		</div>
	);
}

const chartConfig = {
	kiso: {
		applied_informatics: {
			label: "情報",
			color: "#9dd8e9",
		},
		mathematical_sciences: {
			label: "数理",
			color: "#1a46a5",
		},
		culture_and_thoughts: {
			label: "文化・思想",
			color: "#f9919b",
		},
		society_and_networks: {
			label: "社会・ネットワーク",
			color: "#70dac4",
		},
		economy_and_markets: {
			label: "経済・マーケット",
			color: "#ffd878",
		},
		multilingual_information_understanding: {
			label: "多言語情報理解",
			color: "#f91a46",
		},
	},
	tenkai: {
		basic_literacy_subjects: {
			label: "基盤リテラシー科目",
			color: "#1a46a5",
		},
		multilingual_information_understanding_subjects: {
			label: "多言語情報理解科目",
			color: "#f91a46",
		},
		world_understanding_subjects: {
			label: "世界理解科目",
			color: "#70dac4",
		},
		social_connection_subjects: {
			label: "社会接続科目",
			color: "#9c9d86",
		},
	},
} satisfies { [key: string]: ChartConfig };

export default function LimitStatus(props: {
	passed: Attainment[];
	added: Subject[];
	className?: string;
}) {
	const [withAdded, setWithAdded] = useState(true);
	const mergedSubjects = useMemo(() => {
		return withAdded
			? [
					...props.passed.map((p) => p.subject).filter((e) => !!e),
					...props.added,
				]
			: props.passed.map((p) => p.subject).filter((e) => !!e);
	}, [props.passed, props.added, withAdded]);

	const [basicCount, kisoChartData, tenkai, tenkaiChartData, totalCount] =
		useMemo(() => {
			const p = mergedSubjects;
			const countById = (
				subjectCategoryId: (typeof subjectCategories)[number]["id"],
				filterBasic: boolean = false,
			) => {
				return p
					.filter((s) => s.subjectCategoryIds.includes(subjectCategoryId))
					.filter((s) => (filterBasic ? s.numbering.startsWith("BSC") : true))
					.reduce((a, c) => a + (parseInt(c.metadata.credit, 10) ?? 0), 0);
			};

			const basicCount = countById("basic");

			const kisoChartData = [
				{
					applied_informatics: countById("applied_informatics", true),
					mathematical_sciences: countById("mathematical_sciences", true),
					culture_and_thoughts: countById("culture_and_thoughts", true),
					society_and_networks: countById("society_and_networks", true),
					economy_and_markets: countById("economy_and_markets", true),
					multilingual_information_understanding: countById(
						"multilingual_information_understanding",
						true,
					),
				},
			];
			const tenkaiChartData = [
				{
					// 基盤リテラシー科目から、2.「基礎科目」の履修も合わせ８単位以上修得すること。
					basic_literacy_subjects:
						countById("applied_informatics") +
						countById("mathematical_sciences"),
					multilingual_information_understanding_subjects: countById(
						"multilingual_information_understanding",
					),
					world_understanding_subjects:
						countById("culture_and_thoughts") +
						countById("society_and_networks") +
						countById("economy_and_markets") +
						countById("digital_industry"),
					social_connection_subjects: Math.min(
						10,
						countById("social_connection"),
					),
				},
			];

			const tenkai = (() => {
				/* 
			type SubjectCategoryType = {
				label: string;
				value: string;
				children: readonly SubjectCategoryType[];
			};

			type BuildTree<T extends SubjectCategoryType> = {
				credits: number;
				required: number | undefined;
				children: {
					[C in T["children"][number] as C["value"]]: BuildTree<C>;
				};
			};

			type Tenkai = {
				[K in Exclude<
					(typeof searchOptions.subjectCategoryOptions)[number],
					{
						value:
							| "basic_subjects"
							| "graduation_project_subjects"
							| "free_subjects";
					}
				> as K["value"]]: BuildTree<K>;
			};
			// こんなに型がいるか？知らん

			const tenkai: Tenkai = {
				basic_literacy_subjects: {
					credits: 0,
					children: {
						applied_informatics: {
							credits: 0,
							children: {},
							required: undefined,
						},
						mathematical_sciences: {
							credits: 0,
							children: [],
							required: undefined,
						},
					},
					required: 8,
				},
				multilingual_information_understanding_subjects: {
					credits: 0,
					children: {
						multilingual_information_understanding: {
							credits: 0,
							children: {},
							required: undefined,
						},
					},
					required: 8,
				},
				world_understanding_subjects: {
					credits: 0,
					children: {
						culture_and_thoughts: {
							credits: 0,
							children: {},
							required: 2,
						},
						society_and_networks: {
							credits: 0,
							children: {},
							required: 2,
						},
						economy_and_markets: {
							credits: 0,
							children: {},
							required: 2,
						},
						digital_industry: {
							credits: 0,
							children: {},
							required: 2,
						},
					},
					required: 26,
				},
				social_connection_subjects: {
					credits: 0,
					children: {
						social_connection: {
							credits: 0,
							children: {},
							required: undefined,
						},
					},
					required: 10,
				},
			};

			*/

				const tenkai = {
					basic_literacy_subjects: {
						credits:
							countById("applied_informatics") +
							countById("mathematical_sciences"),
					},
					multilingual_information_understanding_subjects: {
						credits: countById("multilingual_information_understanding"),
					},
					world_understanding_subjects: {
						credits:
							countById("culture_and_thoughts") +
							countById("society_and_networks") +
							countById("economy_and_markets") +
							countById("digital_industry"),
						hasRequiredCredit: !!p.find(
							// ①「デジタル産業」の「IT産業史」「マンガ産業史」「アニメ産業史」「日本のゲーム産業史」の中から、２単位以上修得すること。
							(a) =>
								[
									"DIGI-1-B1-1030-001",
									"DIGI-1-B1-1030-002",
									"DIGI-1-B1-0204-003",
									"DIGI-1-B1-0204-004",
								].includes(a.numbering),
						),
					},
					social_connection_subjects: {
						// max 10
						credits: Math.min(10, countById("social_connection")),
						// if more then 10, write real
						// if not, same as credit
						realCredit: countById("social_connection"),
					},
				};

				return tenkai;
			})();

			const totalCount =
				p.reduce(
					(acc, cur) => acc + (parseInt(cur.metadata.credit, 10) ?? 0),
					0,
				) -
				(tenkai.social_connection_subjects.realCredit -
					tenkai.social_connection_subjects.credits);

			// const gradZemi = p.find()
			// TODO

			return [basicCount, kisoChartData, tenkai, tenkaiChartData, totalCount];
		}, [mergedSubjects]);

	return (
		<Card className={props.className}>
			<CardHeader className="flex justify-between items-center">
				<CardDescription>
					<HoverCard>
						<HoverCardTrigger>
							<LinkToExternal href="https://img.zen-univ.jp/studentBook/sotugyouYouken.pdf">
								卒業要件PDF
							</LinkToExternal>
						</HoverCardTrigger>
						<HoverCardContent className="space-y-2 text-sm leading-relaxed w-full max-w-screen">
							<Requirements />
						</HoverCardContent>
					</HoverCard>
				</CardDescription>
				<CardTitle>科目状況</CardTitle>
				<Toggle
					value={withAdded}
					setValue={setWithAdded}
					label="カートを含む"
				/>
			</CardHeader>
			<CardContent className="flex flex-col text-start">
				<div className="mr-8">
					<ProgressBar value={basicCount} max={14} title="導入科目" />
				</div>

				<Accordion type="single" collapsible>
					<AccordionItem value="item-1">
						<AccordionTrigger className="flex items-center">
							<div className="w-full flex flex-col">
								<div className="w-full mb-4">
									<h3>基礎科目</h3>
									<div className="flex items-center gap-2">
										<ChartContainer
											config={chartConfig.kiso}
											className="h-16 w-full bg-transparent"
										>
											<BarChart
												accessibilityLayer
												data={kisoChartData}
												layout="vertical"
												maxBarSize={8}
											>
												<CartesianGrid
													fill={"#eee"}
													horizontal={false}
													vertical={false}
													height={8}
												/>
												<XAxis type="number" hide domain={[0, 12]} />
												<YAxis type="category" hide />
												<ChartLegend content={<ChartLegendContent />} />
												<Bar
													dataKey="mathematical_sciences"
													stackId="a"
													fill="var(--color-mathematical_sciences)"
													radius={[4, 0, 0, 4]}
												/>
												<Bar
													dataKey="applied_informatics"
													stackId="a"
													fill="var(--color-applied_informatics)"
												/>
												<Bar
													dataKey="culture_and_thoughts"
													stackId="a"
													fill="var(--color-culture_and_thoughts)"
												/>
												<Bar
													dataKey="society_and_networks"
													stackId="a"
													fill="var(--color-society_and_networks)"
												/>
												<Bar
													dataKey="economy_and_markets"
													stackId="a"
													fill="var(--color-economy_and_markets)"
												/>
												<Bar
													dataKey="multilingual_information_understanding"
													stackId="a"
													fill="var(--color-multilingual_information_understanding)"
													radius={[0, 4, 4, 0]}
												/>
											</BarChart>
										</ChartContainer>
										<Label className="w-6">
											{Object.entries(kisoChartData[0]).reduce(
												(a, c) => a + c[1],
												0,
											)}
											/12
										</Label>
									</div>
								</div>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<div className="pl-4 pr-2">
								{(
									Object.keys(kisoChartData[0]) as Array<
										keyof (typeof kisoChartData)[0]
									>
								).map((kamoku) => (
									<ProgressBar
										value={kisoChartData[0][kamoku]}
										key={kamoku}
										max={2}
										title={
											subjectCategories.find((e) => e.id === kamoku)?.name || ""
										}
										color={chartConfig.kiso[kamoku].color}
										checked={
											chartConfig.kiso[kamoku].label !== "多言語情報理解"
												? kisoChartData[0][kamoku] >= 2
												: kisoChartData[0][kamoku] >= 2 // 多言語情報理解は必須2単位
										}
									/>
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				<Accordion type="single" collapsible>
					<AccordionItem value="item-1">
						<AccordionTrigger className="flex items-center">
							<div className="w-full flex flex-col">
								<div className="w-full mb-4">
									<h3>展開科目</h3>
									<div className="flex items-center gap-2">
										<ChartContainer
											config={chartConfig.tenkai}
											className="h-16 w-full bg-gray"
										>
											<BarChart
												accessibilityLayer
												data={tenkaiChartData}
												layout="vertical"
												maxBarSize={8}
											>
												<CartesianGrid
													fill={"#eee"}
													horizontal={false}
													vertical={false}
													height={8}
												/>
												<XAxis type="number" hide domain={[0, 74]} />
												<YAxis type="category" hide />
												<ChartLegend content={<ChartLegendContent />} />
												<Bar
													dataKey="basic_literacy_subjects"
													stackId="a"
													fill="var(--color-basic_literacy_subjects)"
													radius={[4, 0, 0, 4]}
												/>
												<Bar
													dataKey="multilingual_information_understanding_subjects"
													stackId="a"
													fill="var(--color-multilingual_information_understanding_subjects)"
												/>
												<Bar
													dataKey="world_understanding_subjects"
													stackId="a"
													fill="var(--color-world_understanding_subjects)"
												/>
												<Bar
													dataKey="social_connection_subjects"
													stackId="a"
													fill="var(--color-social_connection_subjects)"
													radius={[0, 4, 4, 0]}
												/>
											</BarChart>
										</ChartContainer>
										<Label className="w-6">
											{Object.entries(kisoChartData[0]).reduce(
												(a, c) => a + c[1],
												0,
											)}
											/74
										</Label>
									</div>
								</div>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<div className="pl-4 pr-2">
								<ProgressBar
									value={tenkai.basic_literacy_subjects.credits}
									max={8}
									title="基盤リテラシー科目"
									color={chartConfig.tenkai.basic_literacy_subjects.color}
									checked={tenkai.basic_literacy_subjects.credits >= 8}
								/>
								<ProgressBar
									value={
										tenkai.multilingual_information_understanding_subjects
											.credits
									}
									max={8}
									title="多言語情報理解科目"
									color={
										chartConfig.tenkai
											.multilingual_information_understanding_subjects.color
									}
									checked={
										tenkai.multilingual_information_understanding_subjects
											.credits >= 8
									}
								/>
								<ProgressBar
									value={tenkai.world_understanding_subjects.credits}
									max={26}
									title="世界理解科目"
									color={chartConfig.tenkai.world_understanding_subjects.color}
									checked={
										tenkai.world_understanding_subjects.credits >= 26 &&
										tenkai.world_understanding_subjects.hasRequiredCredit
									}
								/>
								{/* <HoverCard>
									<HoverCardTrigger className="text-blue-500 underline cursor-help">
										{tenkai.world_understanding_subjects.hasRequiredCredit
											? "OK"
											: "BAD"}
									</HoverCardTrigger>
									<HoverCardContent>
										「デジタル産業」の「IT産業史」「マンガ産業史」「アニメ産業史」「日本のゲーム産業史」の中から、２単位以上修得すること。
									</HoverCardContent>
								</HoverCard> */}

								<ProgressBar
									value={tenkai.social_connection_subjects.credits}
									max={10}
									title="社会接続科目"
									color={chartConfig.tenkai.social_connection_subjects.color}
									checked={false}
									tooltip={"社会接続科目は10単位までしか卒業要件に含まれません"}
								/>
								{tenkai.social_connection_subjects.realCredit > 10 &&
									"too many social"}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				<div className="pr-8">
					<ProgressBar value={0} max={4} title="卒業プロジェクト科目" />
				</div>
				<div className="pr-8 pt-4">
					<ProgressBar value={totalCount} max={124} title="総単位数" />
				</div>
			</CardContent>
		</Card>
	);
}

function Requirements() {
	return (
		<>
			<p>本学の卒業要件は、以下のすべての条件を満たしたものとする。</p>
			<ul className="list-disc space-y-1 pl-4">
				<li>124単位以上修得すること。</li>
				<li>以下の要件を満たすこと。</li>
			</ul>
			<ol className="list-decimal space-y-2 pl-4">
				<li>
					<p>「導入科目」</p>
					<p>「導入科目」から14単位を修得すること。</p>
				</li>
				<li>
					<p>「基礎科目」</p>
					<p>
						以下の要件を満たした上で、「基礎科目」から12単位以上修得すること。
					</p>
					<ul className="space-y-1 pl-5">
						<li>
							①「数理」「情報」「文化・思想」「社会・ネットワーク」「経済・マーケット」の定められた科目群のそれぞれから、２単位以上修得すること。
						</li>
						<li>②「多言語ITコミュニケーション」２単位を修得すること。</li>
					</ul>
				</li>
				<li>
					<p>「展開科目」</p>
					<p>
						以下の要件を満たした上で、「展開科目」から74単位以上修得すること。
					</p>
					<ul className="space-y-1 pl-5">
						<li>
							3-1
							「基盤リテラシー科目」：基盤リテラシー科目から、2.「基礎科目」の履修も合わせ８単位以上修得すること。
						</li>
						<li>
							3-2
							「多言語情報理解科目」：「多言語情報理解科目」から、2.「基礎科目」の履修も合わせ８単位以上修得すること。
						</li>
						<li>
							3-3
							「世界理解科目」：以下の要件を満たした上で、「世界理解科目」から、2.「基礎科目」の履修も合わせ26単位以上修得すること。
							<ul className="space-y-1 pl-5">
								<li>
									①「デジタル産業」の「IT産業史」「マンガ産業史」「アニメ産業史」「日本のゲーム産業史」の中から、２単位以上修得すること。
								</li>
							</ul>
						</li>
						<li>
							3-4
							「社会接続科目」：「社会接続科目」から卒業要件に算入できる単位数の上限は、10単位までとする。
						</li>
					</ul>
				</li>
				<li>
					<p>「卒業プロジェクト科目」</p>
					<p>「プロジェクト実践」４単位を修得すること。</p>
				</li>
			</ol>
		</>
	);
}
