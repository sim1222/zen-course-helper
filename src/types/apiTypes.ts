import type {
	Quarter,
	searchOptions,
	subjectCategories,
} from "@/lib/syllabusConsts";
import type { ValueOf } from "./utilTypes";

export interface SearchResponse {
	totalCount: number;
	pageSize: number;
	page: number;
	totalPages: number;
	relatedTags: RelatedTag[];
	subjects: Subject[];
}

export interface RelatedTag {
	id: number;
	name: string;
}

export interface Subject {
	numbering: string; // BSC-1-B1-1030-001
	name: string;
	description: string;
	thumbnailUrl: string;
	openingYear: string;
	faculty: Faculty[];
	tags: Tag[];
	movieUrl: string;
	metadata: Metadata;
	coursePlans: CoursePlan[];
	relatedSubjects: RelatedSubject[];
	dayOfWeek: unknown[];
	subjectCategoryIds: (typeof subjectCategories)[number]["id"][];
	coursePatternIds: number[];
}

/**
 * 講師の情報
 */
export interface Faculty {
	id: number; // 999
	name: string; // 順次公開予定
	reading: string; // ジュンジコウカイヨテイ
	isForeign: boolean; // true
	title: string; // 講師
	expertise: string; // 順次公開予定
	avatarUrl: string; // https://cdn.syllabus.zen.ac.jp/images/faculty/999.webp
}

export interface Tag {
	id: number;
	name: string;
}

export interface Metadata {
	enrollmentGrade: string; // 1年次
	teachingMethod: (typeof searchOptions.teachingMethodOptions)[number]["label"];
	prerequisiteSubjects: PrerequisiteSubject[];
	prerequisiteRecommendedSubjects: PrerequisiteRecommendedSubject[];
	nextRecommendedSubjects: NextRecommendedSubject[];
	subjectRequirement: string;
	evaluationSystem: string;
	objective: string;
	credit: string;
	quarters: ValueOf<typeof Quarter>[];
	specialNotes: string;
	textBooks: TextBook[];
	referenceBooks: ReferenceBook[];
	learningOutsideClass: string;
}

interface BaseSubjectLink<TagType = Tag[]> {
	numbering: string; // OPT-1-C1-1030-999
	name: string; // 特記事項参照(2025年度)
	description: string; // 順次公開予定
	thumbnailUrl: string; // https://cdn.syllabus.zen.ac.jp/images/subjects/OPT-1-C1-1030-999.webp
	openingYear: string; // 2025
	faculty: Faculty[];
	tags: TagType;
}

export type PrerequisiteSubject = BaseSubjectLink<unknown[]>;

export type PrerequisiteRecommendedSubject = BaseSubjectLink<unknown[]>;

export type NextRecommendedSubject = BaseSubjectLink<unknown[]>;

export interface TextBook {
	title: string;
}

export interface ReferenceBook {
	title: string;
}

export interface CoursePlan {
	title: string;
	description: string;
	sections: unknown[];
}

export interface RelatedSubject extends BaseSubjectLink<Tag[]> {
	subtitle?: string;
}
