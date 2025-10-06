export type QueryParams = {
	opening_year?: number[]; // 2025
	enrollment_grade?: (1 | 2 | 3 | 4)[];
	course_pattern_id?: (keyof typeof CoursePattern)[];
	subject_category_id?: (typeof subjectCategories)[number]["id"][]; // basic
	tag_id?: (keyof typeof Tags)[]; // 108
	quarter?: (keyof typeof Quarter)[]; // 3q
	teaching_method?: keyof typeof TeachingMethod; // on-demand
	credit?: 1 | 2 | 4; // 1
	faculty_member_id?: number; // 19
	day_of_week?: (keyof typeof DayOfWeek)[]; // tuesday
	sort?: (typeof SortOptions)[number]["value"]; // name-asc
	page?: number; // 1
};

export const Tags = {
	// 1: "授業形式",
	101: "インタビュー",
	102: "オムニバス",
	103: "グループワーク",
	104: "ゲスト講師",
	108: "作品制作",
	107: "実践トレーニング",
	105: "ディスカッション",
	109: "フィールドワーク",
	106: "プレゼンテーション",
	110: "みんなで作ろう",
	111: "pixiv提携科目",

	// 2: "ツール",
	201: "CLIP STUDIO PAINT",
	202: "Python",
	203: "AdobeCC",

	// 3: "身につけたい力",
	301: "アントレプレナーシップ",
	309: "異文化理解",
	310: "英語力",
	311: "温故知新",
	312: "課題解決力",
	313: "課題発見力",
	315: "観察力",
	316: "企画力",
	317: "技術力",
	302: "グローバル",
	318: "決断力",
	320: "行動力",
	319: "語学力",
	303: "コミュ力",
	322: "思考力",
	321: "仕事術",
	323: "自然言語処理",
	324: "実務能力",
	326: "柔軟性",
	325: "主体性",
	327: "情報理論の基礎",
	328: "数学的思考力",
	329: "創造性",
	330: "想像力",
	331: "定理証明支援系",
	337: "データサイエンス",
	305: "データ分析力",
	304: "データ前処理",
	306: "ネットリテラシー",
	332: "美的感覚",
	336: "俯瞰力",
	307: "プログラミング力",
	333: "分析力",
	334: "編集力",
	314: "学び続ける",
	308: "リーダーシップ",
	335: "論理的思考力",

	// 4: "なりたい姿",
	405: "アートを探求する",
	419: "暗号の仕組みを知りたい",
	420: "異文化に触れたい",
	406: "インフラに強くなる",
	421: "炎上を避けたい",
	407: "エンタメに携わりたい",
	466: "お金を稼ぎたい",
	408: "オタクが仕事になる",
	422: "学者になりたい",
	423: "環境問題を解決したい",
	424: "起業したい",
	469: "キャリアを考える",
	409: "クリエイターになりたい",
	426: "経営者になりたい",
	427: "経済の仕組みを知りたい",
	428: "健康でいたい",
	429: "現象の背後にある真理を探求したい",
	430: "構造的に考えられるようになりたい",
	431: "最先端技術を学びたい",
	434: "自己を知る",
	435: "自分に合う仕事を見つけたい",
	436: "自分の言葉で表現したい",
	440: "社会人基礎力を身につけたい",
	437: "社会に貢献したい",
	438: "社会の仕組みを知りたい",
	441: "社会問題を解決したい",
	433: "視野を広げたい",
	442: "就活基礎力が身に着く",
	443: "証明したい",
	432: "思慮深くなりたい",
	444: "真理を追求したい",
	447: "数学ができるようになりたい",
	449: "数学の応用が知りたい",
	448: "数学のすごさを知りたい",
	446: "数学を少し知りたい",
	451: "正義について考えたい",
	450: "世界を知りたい",
	452: "創作力を伸ばしたい",
	453: "他者理解を深めたい",
	454: "多様性を理解したい",
	455: "抽象的に考えられるようになりたい",
	425: "強い心を持ちたい",
	456: "定性的なデータを分析したい",
	467: "データサイエンスを学びたい",
	410: "データに基づいた判断力",
	411: "できるエンジニアになりたい",
	412: "デジタルイラストが描きたい",
	468: "ネット時代の生き方を知る",
	413: "ハッキングに詳しくなる",
	439: "話のタネになる",
	445: "人と繋がりたい",
	457: "批判的にものを見たい",
	459: "本当の自分を知りたい",
	414: "マグカップをドーナツにしたい",
	465: "メンタルヘルスを保ちたい",
	415: "ものづくりがしたい",
	458: "豊かさを知りたい",
	460: "予測不能な時代を生きる力",
	416: "リアルな今を知りたい",
	417: "リーダーになりたい",
	461: "留学に挑戦したい",
	462: "量子エリートになりたい",
	463: "歴史を紐解きたい",
	464: "論理的に考えたい",
	418: "わくわくしたい",
	401: "AIと付き合う",
	402: "AIを学びたい",
	403: "Webアプリを作る",
	404: "ZEN大ライフをZEN力で楽しみたい",

	// 501: "順次公開",
	500: "順次公開",
} as const satisfies Record<number, string>;

export const CoursePattern = {
	2: "履修パターン例 文化・思想系",
	3: "履修パターン例 社会・ネットワーク系",
	4: "履修パターン例 経済・マーケット系",
	5: "履修パターン例 情報系",
	6: "履修パターン例 数理系",
	7: "履修パターン例 クリエイティブ系",
} as const satisfies Record<number, string>;

export const Quarter = {
	"1q": "1Q",
	"2q": "2Q",
	"3q": "3Q",
	"4q": "4Q",
	"1-2q": "1-2Q",
	"3-4q": "3-4Q",
	annual: "通期",
} as const satisfies Record<string, string>;

export const TeachingMethod = {
	"on-demand": "オンデマンド",
	"live-video": "ライブ映像",
	exercise: "演習",
	seminar: "ゼミ",
} as const satisfies Record<string, string>;

export const DayOfWeek = {
	monday: "月",
	tuesday: "火",
	wednesday: "水",
	thursday: "木",
	friday: "金",
	intensive: "集中講義",
} as const satisfies Record<string, string>;

export const subjectCategories = [
	{ id: "basic", name: "導入", category: "導入科目" },
	{
		id: "applied_informatics",
		name: "情報",
		category: "基盤リテラシー科目",
	},
	{
		id: "mathematical_sciences",
		name: "数理",
		category: "基盤リテラシー科目",
	},
	{
		id: "multilingual_information_understanding",
		name: "多言語情報理解",
		category: "多言語情報理解科目",
	},
	{
		id: "culture_and_thoughts",
		name: "文化・思想",
		category: "世界理解科目",
	},
	{
		id: "society_and_networks",
		name: "社会・ネットワーク",
		category: "世界理解科目",
	},
	{
		id: "economy_and_markets",
		name: "経済・マーケット",
		category: "世界理解科目",
	},
	{ id: "digital_industry", name: "デジタル産業", category: "世界理解科目" },
	{
		id: "social_connection",
		name: "社会接続",
		category: "社会接続科目",
	},
	{
		id: "graduation_project",
		name: "卒業プロジェクト",
		category: "卒業プロジェクト科目",
	},
	{ id: "free", name: "自由科目", category: "自由科目" },
] as const satisfies ReadonlyArray<{
	id: string;
	name: string;
	category: string;
}>;

export const SortOptions = [
	{ label: "科目名昇順", value: "name-asc" },
	{ label: "科目名降順", value: "name-desc" },
] as const satisfies ReadonlyArray<{ label: string; value: string }>;

/**
 * 履修上限単位数（CAP制）
 *
 * ## 履修登録上限単位数（CAP制）の例外
 * 以下は、履修登録上限単位数（CAP制）に含まれません。
 * - 入学前の学修について単位認定されたもの（入学前単位認定）。
 * - 入学後に国内外の他大学等で修得し、単位認定されたもの（他教育機関の単位認定、留学による単位認定など）。
 * - 大学以外の教育施設等で修得し、単位認定されたもの（資格による単位認定など）。
 */
export const CAP = 48;

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

export const searchOptions = {
	openingYearOptions: [
		{
			label: "2025年度",
			value: "2025",
		},
		{
			label: "2026年度",
			value: "2026",
		},
		{
			label: "2027年度",
			value: "2027",
		},
		{
			label: "2028年度",
			value: "2028",
		},
	],
	enrollmentGradeOptions: [
		{
			label: "1年次",
			value: "1",
		},
		{
			label: "2年次",
			value: "2",
		},
		{
			label: "3年次",
			value: "3",
		},
		{
			label: "4年次",
			value: "4",
		},
	],
	coursePatternOptions: [
		{
			label: "履修パターン例",
			value: "1",
			children: [
				{
					label: "履修パターン例",
					value: "8",
					children: [
						{
							label: "履修パターン例 文化・思想系",
							value: "2",
							children: [],
						},
						{
							label: "履修パターン例 社会・ネットワーク系",
							value: "3",
							children: [],
						},
						{
							label: "履修パターン例 経済・マーケット系",
							value: "4",
							children: [],
						},
						{
							label: "履修パターン例 情報系",
							value: "5",
							children: [],
						},
						{
							label: "履修パターン例 数理系",
							value: "6",
							children: [],
						},
						{
							label: "履修パターン例 クリエイティブ系",
							value: "7",
							children: [],
						},
					],
				},
			],
		},
	],
	subjectCategoryOptions: [
		{
			label: "導入科目",
			value: "basic_subjects",
			children: [
				{
					label: "導入",
					value: "basic",
					children: [],
				},
			],
		},
		{
			label: "基盤リテラシー科目",
			value: "basic_literacy_subjects",
			children: [
				{
					label: "情報",
					value: "applied_informatics",
					children: [],
				},
				{
					label: "数理",
					value: "mathematical_sciences",
					children: [],
				},
			],
		},
		{
			label: "多言語情報理解科目",
			value: "multilingual_information_understanding_subjects",
			children: [
				{
					label: "多言語情報理解",
					value: "multilingual_information_understanding",
					children: [],
				},
			],
		},
		{
			label: "世界理解科目",
			value: "world_understanding_subjects",
			children: [
				{
					label: "文化・思想",
					value: "culture_and_thoughts",
					children: [],
				},
				{
					label: "社会・ネットワーク",
					value: "society_and_networks",
					children: [],
				},
				{
					label: "経済・マーケット",
					value: "economy_and_markets",
					children: [],
				},
				{
					label: "デジタル産業",
					value: "digital_industry",
					children: [],
				},
			],
		},
		{
			label: "社会接続科目",
			value: "social_connection_subjects",
			children: [
				{
					label: "社会接続",
					value: "social_connection",
					children: [],
				},
			],
		},
		{
			label: "卒業プロジェクト科目",
			value: "graduation_project_subjects",
			children: [
				{
					label: "卒業プロジェクト",
					value: "graduation_project",
					children: [],
				},
			],
		},
		{
			label: "自由科目",
			value: "free_subjects",
			children: [
				{
					label: "自由科目",
					value: "free",
					children: [],
				},
			],
		},
	],
	tagOptions: [
		{
			label: "授業形式",
			value: "1",
			children: [
				{
					label: "インタビュー",
					value: "101",
					children: [],
				},
				{
					label: "オムニバス",
					value: "102",
					children: [],
				},
				{
					label: "グループワーク",
					value: "103",
					children: [],
				},
				{
					label: "ゲスト講師",
					value: "104",
					children: [],
				},
				{
					label: "作品制作",
					value: "108",
					children: [],
				},
				{
					label: "実践トレーニング",
					value: "107",
					children: [],
				},
				{
					label: "ディスカッション",
					value: "105",
					children: [],
				},
				{
					label: "フィールドワーク",
					value: "109",
					children: [],
				},
				{
					label: "プレゼンテーション",
					value: "106",
					children: [],
				},
				{
					label: "みんなで作ろう",
					value: "110",
					children: [],
				},
				{
					label: "pixiv提携科目",
					value: "111",
					children: [],
				},
			],
		},
		{
			label: "ツール",
			value: "2",
			children: [
				{
					label: "CLIP STUDIO PAINT",
					value: "201",
					children: [],
				},
				{
					label: "Python",
					value: "202",
					children: [],
				},
				{
					label: "AdobeCC",
					value: "203",
					children: [],
				},
			],
		},
		{
			label: "身につけたい力",
			value: "3",
			children: [
				{
					label: "アントレプレナーシップ",
					value: "301",
					children: [],
				},
				{
					label: "異文化理解",
					value: "309",
					children: [],
				},
				{
					label: "英語力",
					value: "310",
					children: [],
				},
				{
					label: "温故知新",
					value: "311",
					children: [],
				},
				{
					label: "課題解決力",
					value: "312",
					children: [],
				},
				{
					label: "課題発見力",
					value: "313",
					children: [],
				},
				{
					label: "観察力",
					value: "315",
					children: [],
				},
				{
					label: "企画力",
					value: "316",
					children: [],
				},
				{
					label: "技術力",
					value: "317",
					children: [],
				},
				{
					label: "グローバル",
					value: "302",
					children: [],
				},
				{
					label: "決断力",
					value: "318",
					children: [],
				},
				{
					label: "行動力",
					value: "320",
					children: [],
				},
				{
					label: "語学力",
					value: "319",
					children: [],
				},
				{
					label: "コミュ力",
					value: "303",
					children: [],
				},
				{
					label: "思考力",
					value: "322",
					children: [],
				},
				{
					label: "仕事術",
					value: "321",
					children: [],
				},
				{
					label: "自然言語処理",
					value: "323",
					children: [],
				},
				{
					label: "実務能力",
					value: "324",
					children: [],
				},
				{
					label: "柔軟性",
					value: "326",
					children: [],
				},
				{
					label: "主体性",
					value: "325",
					children: [],
				},
				{
					label: "情報理論の基礎",
					value: "327",
					children: [],
				},
				{
					label: "数学的思考力",
					value: "328",
					children: [],
				},
				{
					label: "創造性",
					value: "329",
					children: [],
				},
				{
					label: "想像力",
					value: "330",
					children: [],
				},
				{
					label: "定理証明支援系",
					value: "331",
					children: [],
				},
				{
					label: "データサイエンス",
					value: "337",
					children: [],
				},
				{
					label: "データ分析力",
					value: "305",
					children: [],
				},
				{
					label: "データ前処理",
					value: "304",
					children: [],
				},
				{
					label: "ネットリテラシー",
					value: "306",
					children: [],
				},
				{
					label: "美的感覚",
					value: "332",
					children: [],
				},
				{
					label: "俯瞰力",
					value: "336",
					children: [],
				},
				{
					label: "プログラミング力",
					value: "307",
					children: [],
				},
				{
					label: "分析力",
					value: "333",
					children: [],
				},
				{
					label: "編集力",
					value: "334",
					children: [],
				},
				{
					label: "学び続ける",
					value: "314",
					children: [],
				},
				{
					label: "リーダーシップ",
					value: "308",
					children: [],
				},
				{
					label: "論理的思考力",
					value: "335",
					children: [],
				},
			],
		},
		{
			label: "なりたい姿",
			value: "4",
			children: [
				{
					label: "アートを探求する",
					value: "405",
					children: [],
				},
				{
					label: "暗号の仕組みを知りたい",
					value: "419",
					children: [],
				},
				{
					label: "異文化に触れたい",
					value: "420",
					children: [],
				},
				{
					label: "インフラに強くなる",
					value: "406",
					children: [],
				},
				{
					label: "炎上を避けたい",
					value: "421",
					children: [],
				},
				{
					label: "エンタメに携わりたい",
					value: "407",
					children: [],
				},
				{
					label: "お金を稼ぎたい",
					value: "466",
					children: [],
				},
				{
					label: "オタクが仕事になる",
					value: "408",
					children: [],
				},
				{
					label: "学者になりたい",
					value: "422",
					children: [],
				},
				{
					label: "環境問題を解決したい",
					value: "423",
					children: [],
				},
				{
					label: "起業したい",
					value: "424",
					children: [],
				},
				{
					label: "キャリアを考える",
					value: "469",
					children: [],
				},
				{
					label: "クリエイターになりたい",
					value: "409",
					children: [],
				},
				{
					label: "経営者になりたい",
					value: "426",
					children: [],
				},
				{
					label: "経済の仕組みを知りたい",
					value: "427",
					children: [],
				},
				{
					label: "健康でいたい",
					value: "428",
					children: [],
				},
				{
					label: "現象の背後にある真理を探求したい",
					value: "429",
					children: [],
				},
				{
					label: "構造的に考えられるようになりたい",
					value: "430",
					children: [],
				},
				{
					label: "最先端技術を学びたい",
					value: "431",
					children: [],
				},
				{
					label: "自己を知る",
					value: "434",
					children: [],
				},
				{
					label: "自分に合う仕事を見つけたい",
					value: "435",
					children: [],
				},
				{
					label: "自分の言葉で表現したい",
					value: "436",
					children: [],
				},
				{
					label: "社会人基礎力を身につけたい",
					value: "440",
					children: [],
				},
				{
					label: "社会に貢献したい",
					value: "437",
					children: [],
				},
				{
					label: "社会の仕組みを知りたい",
					value: "438",
					children: [],
				},
				{
					label: "社会問題を解決したい",
					value: "441",
					children: [],
				},
				{
					label: "視野を広げたい",
					value: "433",
					children: [],
				},
				{
					label: "就活基礎力が身に着く",
					value: "442",
					children: [],
				},
				{
					label: "証明したい",
					value: "443",
					children: [],
				},
				{
					label: "思慮深くなりたい",
					value: "432",
					children: [],
				},
				{
					label: "真理を追求したい",
					value: "444",
					children: [],
				},
				{
					label: "数学ができるようになりたい",
					value: "447",
					children: [],
				},
				{
					label: "数学の応用が知りたい",
					value: "449",
					children: [],
				},
				{
					label: "数学のすごさを知りたい",
					value: "448",
					children: [],
				},
				{
					label: "数学を少し知りたい",
					value: "446",
					children: [],
				},
				{
					label: "正義について考えたい",
					value: "451",
					children: [],
				},
				{
					label: "世界を知りたい",
					value: "450",
					children: [],
				},
				{
					label: "創作力を伸ばしたい",
					value: "452",
					children: [],
				},
				{
					label: "他者理解を深めたい",
					value: "453",
					children: [],
				},
				{
					label: "多様性を理解したい",
					value: "454",
					children: [],
				},
				{
					label: "抽象的に考えられるようになりたい",
					value: "455",
					children: [],
				},
				{
					label: "強い心を持ちたい",
					value: "425",
					children: [],
				},
				{
					label: "定性的なデータを分析したい",
					value: "456",
					children: [],
				},
				{
					label: "データサイエンスを学びたい",
					value: "467",
					children: [],
				},
				{
					label: "データに基づいた判断力",
					value: "410",
					children: [],
				},
				{
					label: "できるエンジニアになりたい",
					value: "411",
					children: [],
				},
				{
					label: "デジタルイラストが描きたい",
					value: "412",
					children: [],
				},
				{
					label: "ネット時代の生き方を知る",
					value: "468",
					children: [],
				},
				{
					label: "ハッキングに詳しくなる",
					value: "413",
					children: [],
				},
				{
					label: "話のタネになる",
					value: "439",
					children: [],
				},
				{
					label: "人と繋がりたい",
					value: "445",
					children: [],
				},
				{
					label: "批判的にものを見たい",
					value: "457",
					children: [],
				},
				{
					label: "本当の自分を知りたい",
					value: "459",
					children: [],
				},
				{
					label: "マグカップをドーナツにしたい",
					value: "414",
					children: [],
				},
				{
					label: "メンタルヘルスを保ちたい",
					value: "465",
					children: [],
				},
				{
					label: "ものづくりがしたい",
					value: "415",
					children: [],
				},
				{
					label: "豊かさを知りたい",
					value: "458",
					children: [],
				},
				{
					label: "予測不能な時代を生きる力",
					value: "460",
					children: [],
				},
				{
					label: "リアルな今を知りたい",
					value: "416",
					children: [],
				},
				{
					label: "リーダーになりたい",
					value: "417",
					children: [],
				},
				{
					label: "留学に挑戦したい",
					value: "461",
					children: [],
				},
				{
					label: "量子エリートになりたい",
					value: "462",
					children: [],
				},
				{
					label: "歴史を紐解きたい",
					value: "463",
					children: [],
				},
				{
					label: "論理的に考えたい",
					value: "464",
					children: [],
				},
				{
					label: "わくわくしたい",
					value: "418",
					children: [],
				},
				{
					label: "AIと付き合う",
					value: "401",
					children: [],
				},
				{
					label: "AIを学びたい",
					value: "402",
					children: [],
				},
				{
					label: "Webアプリを作る",
					value: "403",
					children: [],
				},
				{
					label: "ZEN大ライフをZEN力で楽しみたい",
					value: "404",
					children: [],
				},
			],
		},
		{
			label: "順次公開",
			value: "501",
			children: [
				{
					label: "順次公開",
					value: "500",
					children: [],
				},
			],
		},
	],
	quarterOptions: [
		{
			label: "1Q",
			value: "1q",
		},
		{
			label: "2Q",
			value: "2q",
		},
		{
			label: "3Q",
			value: "3q",
		},
		{
			label: "4Q",
			value: "4q",
		},
		{
			label: "1-2Q",
			value: "1-2q",
		},
		{
			label: "3-4Q",
			value: "3-4q",
		},
		{
			label: "通期",
			value: "annual",
		},
	],
	teachingMethodOptions: [
		{
			label: "オンデマンド科目",
			value: "on-demand",
		},
		{
			label: "ライブ映像科目",
			value: "live-video",
		},
		{
			label: "演習科目",
			value: "exercise",
		},
		{
			label: "ゼミ",
			value: "seminar",
		},
	],
	creditOptions: [
		{
			label: "1単位",
			value: "1",
		},
		{
			label: "2単位",
			value: "2",
		},
		{
			label: "4単位",
			value: "4",
		},
	],
	facultyMemberNameOptions: [
		{
			label: "赤倉 貴子",
			value: "42",
		},
		{
			label: "赤坂 アカ",
			value: "41",
		},
		{
			label: "浅川 りか",
			value: "43",
		},
		{
			label: "浅野 龍哉",
			value: "44",
		},
		{
			label: "東 浩紀",
			value: "33",
		},
		{
			label: "荒川 巧也",
			value: "45",
		},
		{
			label: "有馬 トモユキ",
			value: "46",
		},
		{
			label: "安藤 昭子",
			value: "47",
		},
		{
			label: "池田 達彦",
			value: "29",
		},
		{
			label: "市橋 勝",
			value: "23",
		},
		{
			label: "伊庭 幸人",
			value: "48",
		},
		{
			label: "岩渕 潤子",
			value: "24",
		},
		{
			label: "印南 一路",
			value: "25",
		},
		{
			label: "上山 信一",
			value: "2",
		},
		{
			label: "梅崎 直也",
			value: "35",
		},
		{
			label: "江渡 浩一郎",
			value: "26",
		},
		{
			label: "江間 有沙",
			value: "50",
		},
		{
			label: "遠藤 諭",
			value: "51",
		},
		{
			label: "大塚 英志",
			value: "4",
		},
		{
			label: "大塚 淳",
			value: "5",
		},
		{
			label: "大塚 勇",
			value: "53",
		},
		{
			label: "大野 元己",
			value: "19",
		},
		{
			label: "岡田 雅之",
			value: "34",
		},
		{
			label: "小熊 英二",
			value: "55",
		},
		{
			label: "折原 ダビデ竜",
			value: "36",
		},
		{
			label: "折原 レオナルド賢",
			value: "57",
		},
		{
			label: "ガーバー 明菜",
			value: "37",
		},
		{
			label: "葛木 美紀",
			value: "58",
		},
		{
			label: "加藤 文元",
			value: "6",
		},
		{
			label: "河野 慎",
			value: "31",
		},
		{
			label: "川本 宗孝",
			value: "59",
		},
		{
			label: "木野 泰伸",
			value: "7",
		},
		{
			label: "木許 裕介",
			value: "60",
		},
		{
			label: "小島 芳樹",
			value: "62",
		},
		{
			label: "西郷 甲矢人",
			value: "8",
		},
		{
			label: "斎藤 幸平",
			value: "64",
		},
		{
			label: "作道 直幸",
			value: "30",
		},
		{
			label: "櫻井 快勢",
			value: "65",
		},
		{
			label: "櫻田 英樹",
			value: "9",
		},
		{
			label: "佐藤 弘崇",
			value: "66",
		},
		{
			label: "佐渡島 庸平",
			value: "67",
		},
		{
			label: "下田 スケッチ",
			value: "68",
		},
		{
			label: "鈴木 栄",
			value: "70",
		},
		{
			label: "鈴木 寛",
			value: "69",
		},
		{
			label: "積山 薫",
			value: "10",
		},
		{
			label: "瀬下 大輔",
			value: "38",
		},
		{
			label: "瀬下 翔太",
			value: "71",
		},
		{
			label: "たいら あきら",
			value: "72",
		},
		{
			label: "平 信一",
			value: "73",
		},
		{
			label: "田岡 恵",
			value: "11",
		},
		{
			label: "髙橋 南海子",
			value: "74",
		},
		{
			label: "高橋 弘樹",
			value: "75",
		},
		{
			label: "髙見澤 將林",
			value: "76",
		},
		{
			label: "竹内 薫",
			value: "12",
		},
		{
			label: "竹村 眞一",
			value: "27",
		},
		{
			label: "谷口 祐人",
			value: "39",
		},
		{
			label: "田沼 巌",
			value: "78",
		},
		{
			label: "千葉 尚志",
			value: "17",
		},
		{
			label: "塚越 健司",
			value: "79",
		},
		{
			label: "塚本 圭一郎",
			value: "80",
		},
		{
			label: "辻 順平",
			value: "81",
		},
		{
			label: "津野 貴大",
			value: "82",
		},
		{
			label: "ディープブリザード",
			value: "83",
		},
		{
			label: "出口 康夫",
			value: "84",
		},
		{
			label: "戸塚 隆",
			value: "85",
		},
		{
			label: "中久喜 匠太郎",
			value: "86",
		},
		{
			label: "中村 圭子",
			value: "20",
		},
		{
			label: "夏野 剛",
			value: "87",
		},
		{
			label: "橋本 剛",
			value: "88",
		},
		{
			label: "濱田 庸子",
			value: "90",
		},
		{
			label: "濵田 順教",
			value: "91",
		},
		{
			label: "早川 涼太",
			value: "92",
		},
		{
			label: "伴 龍一郎",
			value: "94",
		},
		{
			label: "氷川 竜介",
			value: "13",
		},
		{
			label: "深津 貴之",
			value: "95",
		},
		{
			label: "藤澤 一就",
			value: "96",
		},
		{
			label: "藤澤 広美",
			value: "97",
		},
		{
			label: "ふるり",
			value: "98",
		},
		{
			label: "細井 浩一",
			value: "14",
		},
		{
			label: "細川 晋輔",
			value: "100",
		},
		{
			label: "前野 俊昭",
			value: "101",
		},
		{
			label: "御手洗 拓真",
			value: "102",
		},
		{
			label: "三戸 麻子",
			value: "103",
		},
		{
			label: "宮本 道人",
			value: "104",
		},
		{
			label: "村藤 功",
			value: "28",
		},
		{
			label: "茂木 誠",
			value: "105",
		},
		{
			label: "山口 真由",
			value: "15",
		},
		{
			label: "山内 康英",
			value: "16",
		},
		{
			label: "湯山 孝雄",
			value: "32",
		},
		{
			label: "横山 カズ",
			value: "107",
		},
		{
			label: "吉田 尚記",
			value: "109",
		},
		{
			label: "吉見 俊哉",
			value: "110",
		},
		{
			label: "吉村 総一郎",
			value: "40",
		},
		{
			label: "六番",
			value: "111",
		},
		{
			label: "若山 正人",
			value: "1",
		},
		{
			label: "渡邉 聡",
			value: "3",
		},
		{
			label: "Hernández Álvaro David",
			value: "18",
		},
		{
			label: "Ivan Fesenko",
			value: "22",
		},
		{
			label: "Pradhan Gouranga Charan",
			value: "21",
		},
		{
			label: "順次公開予定",
			value: "999",
		},
	],
	dayOfWeekOptions: [
		{
			label: "月",
			value: "monday",
		},
		{
			label: "火",
			value: "tuesday",
		},
		{
			label: "水",
			value: "wednesday",
		},
		{
			label: "木",
			value: "thursday",
		},
		{
			label: "金",
			value: "friday",
		},
		{
			label: "集中講義",
			value: "intensive",
		},
	],
} as const;
