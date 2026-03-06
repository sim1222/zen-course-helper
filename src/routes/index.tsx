import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCartIcon } from "lucide-react";
import { useState } from "react";
import LimitStatus from "@/components/LimitStatus";
import { SubjectCart } from "@/components/SubjectCart";
import SubjectChooser from "@/components/SubjectChooser";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
	FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { subjectCategories, TeachingMethod } from "@/lib/syllabusConsts";
import { useAttainmentsStore } from "@/stores/attainmentsStore";
import { useCartStore } from "@/stores/cartStore";
import { useCurrentQuarterStore } from "@/stores/currentQuarterStore";
import { useSubjectsStore } from "@/stores/subjectsStore";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	
	const attainmentsStore = useAttainmentsStore();
	const allSubjectsStore = useSubjectsStore();
	const cartStore = useCartStore();
	const currentQuarterStore = useCurrentQuarterStore();

	const year = currentQuarterStore.Year;
	const quarter = currentQuarterStore.Quarter as 1 | 2 | 3 | 4;

	const [selectedCategory, setSelectedCategory] = useState<
	(typeof subjectCategories)[number]["id"][]
	>([]);

	const [teachingMethod, setTeachingMethod] = useState<
	(keyof typeof TeachingMethod)[]
	>([]);

	const [keyword, setKeyword] = useState("");

	return (
		<div className="text-center">
			<main className="flex flex-col items-center justify-center">
				<div className="flex w-full h-[calc(100vh-3.5rem)] px-4 pt-4 gap-4">
					<div className="w-100 lg:w-100 xl:w-135 shrink-0 flex flex-col gap-4">
						<LimitStatus
							passed={attainmentsStore.Attainments}
							added={cartStore.Cart}
						/>
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
													className="w-fit!"
												>
													<Field
														orientation="horizontal"
														className="gap-1.5 overflow-hidden px-3! py-1.5! transition-all duration-100 ease-linear group-has-data-[state=checked]/field-label:px-2!"
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
										<FieldLegend>授業形態</FieldLegend>
										<FieldGroup className="flex flex-row flex-wrap gap-2 [--radius:9999rem]">
											{Object.keys(TeachingMethod).map((mode) => (
												<FieldLabel
													htmlFor={mode}
													key={mode}
													className="w-fit!"
												>
													<Field
														orientation="horizontal"
														className="gap-1.5 overflow-hidden px-3! py-1.5! transition-all duration-100 ease-linear group-has-data-[state=checked]/field-label:px-2!"
													>
														<Checkbox
															value={mode}
															id={mode}
															onCheckedChange={(checked) => {
																if (checked) {
																	setTeachingMethod((old) => [
																		...old,
																		mode as keyof typeof TeachingMethod,
																	]);
																} else {
																	setTeachingMethod((old) =>
																		old.filter((c) => c !== mode),
																	);
																}
															}}
															checked={teachingMethod.includes(
																mode as keyof typeof TeachingMethod,
															)}
															className="-ml-6 -translate-x-1 rounded-full transition-all duration-100 ease-linear data-[state=checked]:ml-0 data-[state=checked]:translate-x-0"
														/>
														<FieldTitle>
															{
																TeachingMethod[
																	mode as keyof typeof TeachingMethod
																]
															}
														</FieldTitle>
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
							cart={cartStore.Cart}
							setCart={cartStore.setCart}
							keyword={keyword}
							attainments={attainmentsStore.Attainments}
							teachingMethod={teachingMethod}
						/>
					</div>
					<div className="w-80 shrink-0 hidden 2xl:block">
						{/* Desktop */}
						<SubjectCart
							subjects={cartStore.Cart}
							setCart={cartStore.setCart}
						/>
					</div>
				</div>

				<div className="2xl:hidden fixed bottom-4 right-4 z-40">
					{/* Mobile */}
					<Sheet>
						<SheetTrigger asChild>
							<Button size="lg" className="rounded-full size-14 shadow-lg">
								<ShoppingCartIcon className="size-6" />
								{cartStore.Cart.length > 0 && (
									<span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full size-5 flex items-center justify-center">
										{cartStore.Cart.length}
									</span>
								)}
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-80 p-0">
							<SheetHeader className="sr-only">
								<SheetTitle>カート</SheetTitle>
							</SheetHeader>
							<SubjectCart
								subjects={cartStore.Cart}
								setCart={cartStore.setCart}
							/>
						</SheetContent>
					</Sheet>
				</div>
			</main>
		</div>
	);
}
