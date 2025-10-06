import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import LimitStatus from "@/components/LimitStatus";
import SubjectCard from "@/components/SubjectCard";
import { SubjectCart } from "@/components/SubjectCart";
import SubjectChooser from "@/components/SubjectChooser";
import TranscriptParse from "@/components/TranscriptParse";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
	FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { searchSubjects } from "@/lib/apiClient";
import { Quarter, subjectCategories } from "@/lib/syllabusConsts";
import { getQuarterByFormula } from "@/lib/utils";
import { useAttainmentsStore } from "@/stores/attainmentsStore";
import { useSubjectsStore } from "@/stores/subjectsStore";
import type { Subject } from "@/types/apiTypes";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const [selectedCategory, setSelectedCategory] = useState<
		(typeof subjectCategories)[number]["id"][]
	>(subjectCategories.map((c) => c.id));
	const [cart, setCart] = useState<Subject[]>([]);

	const attainmentsStore = useAttainmentsStore();
	const allSubjectsStore = useSubjectsStore();

	const now = useMemo(() => new Date(), []);
	const year = useMemo(() => now.getFullYear(), [now]);
	const quarter = useMemo(() => getQuarterByFormula(now), [now]);

	const [keyword, setKeyword] = useState("");

	return (
		<div className="text-center">
			<main className="flex flex-col items-center justify-center">
				<div className="flex w-full h-[calc(100vh-3.5rem)] px-4 pt-4 gap-4">
					<div className="w-135 shrink-0 flex flex-col gap-4">
						<LimitStatus passed={attainmentsStore.Attainments} added={cart} />
						<Card>
							<CardContent>
								<FieldGroup>
									<FieldSet className="gap-4">
										<FieldLegend>科目</FieldLegend>
										<FieldGroup className="flex flex-row flex-wrap gap-2 [--radius:9999rem]">
											{subjectCategories.map((option) => (
												<FieldLabel
													htmlFor={option.id}
													key={option.id}
													className="!w-fit"
												>
													<Field
														orientation="horizontal"
														className="gap-1.5 overflow-hidden !px-3 !py-1.5 transition-all duration-100 ease-linear group-has-data-[state=checked]/field-label:!px-2"
													>
														<Checkbox
															value={option.id}
															id={option.id}
															onCheckedChange={(checked) => {
																if (checked) {
																	setSelectedCategory((old) => [
																		...old,
																		option.id,
																	]);
																} else {
																	setSelectedCategory((old) =>
																		old.filter((c) => c !== option.id),
																	);
																}
															}}
															checked={selectedCategory.includes(option.id)}
															className="-ml-6 -translate-x-1 rounded-full transition-all duration-100 ease-linear data-[state=checked]:ml-0 data-[state=checked]:translate-x-0"
														/>
														<FieldTitle>{option.name}</FieldTitle>
													</Field>
												</FieldLabel>
											))}
										</FieldGroup>
									</FieldSet>
									<FieldSet>
										<FieldLegend>キーワード絞り込み</FieldLegend>
										<Field className="gap-2">
											<Input
												type="text"
												placeholder="検索..."
												className="w-full"
												value={keyword}
												onChange={(e) => setKeyword(e.target.value)}
											/>
										</Field>
									</FieldSet>
								</FieldGroup>
							</CardContent>
						</Card>
					</div>
					<div className="h-full grow">
						<SubjectChooser
							subjects={allSubjectsStore.subjects}
							category={selectedCategory}
							year={year}
							quarter={quarter}
							cart={cart}
							setCart={setCart}
							keyword={keyword}
							attainments={attainmentsStore.Attainments}
						/>
					</div>
					<div className="w-80 shrink-0">
						<SubjectCart subjects={cart} setCart={setCart} />
					</div>
				</div>
			</main>
		</div>
	);
}
