import { parseCoursesFromText, type Course } from "@/lib/textParser";
import { expect, test } from "vitest";

test("parse course from text ONLY DATA", () => {
	const str = `2025年度2Q
 	 科目	 単位数	 評価	 GPA対象	教員氏名
	導入				
	導入				
	導入科目				
	デジタルツールの使い方	2	A	○	津野 貴大
	経済入門	2	B	○	渡邉 聡
	多言語情報理解				
	多言語情報理解				
	基礎科目				
	多言語ITコミュニケーション	2	B	○	吉村 総一郎
	世界理解				
	文化・思想				
	基礎科目				
	心理学	2	B	○	積山 薫
	経済・マーケット				
	基礎科目				
	企業経営		G	○	上山 信一
	社会接続				
	社会接続				
	展開科目				
	ソーシャルイノベーション概論	2	A	○	鈴木 寛
2025年度1Q
 	 科目	 単位数	 評価	 GPA対象	教員氏名
	導入				
	導入				
	導入科目				
	アカデミックリテラシー	2	P		若山 正人
	ITリテラシー	2	B	○	吉村 総一郎
	人文社会入門		G	○	谷口 祐人
	基盤リテラシー				
	情報				
	基礎科目				
	情報セキュリティ概論		G	○	津野 貴大
	展開科目				
	コンピュータ概論	2	認		
	数理				
	基礎科目				
	数学史		G	○	加藤 文元`;

	const result: Course[] = [
		{ name: "デジタルツールの使い方", credits: 2, grade: "A", isIncludeInGPA: true, teacher: "津野 貴大" },
		{ name: "経済入門", credits: 2, grade: "B", isIncludeInGPA: true, teacher: "渡邉 聡" },
		{ name: "多言語ITコミュニケーション", credits: 2, grade: "B", isIncludeInGPA: true, teacher: "吉村 総一郎" },
		{ name: "心理学", credits: 2, grade: "B", isIncludeInGPA: true, teacher: "積山 薫" },
		{ name: "企業経営", credits: null, grade: "G", isIncludeInGPA: true, teacher: "上山 信一" },
		{ name: "ソーシャルイノベーション概論", credits: 2, grade: "A", isIncludeInGPA: true, teacher: "鈴木 寛" },
		{ name: "アカデミックリテラシー", credits: 2, grade: "P", isIncludeInGPA: false, teacher: "若山 正人" },
		{ name: "ITリテラシー", credits: 2, grade: "B", isIncludeInGPA: true, teacher: "吉村 総一郎" },
		{ name: "人文社会入門", credits: null, grade: "G", isIncludeInGPA: true, teacher: "谷口 祐人" },
		{ name: "情報セキュリティ概論", credits: null, grade: "G", isIncludeInGPA: true, teacher: "津野 貴大" },
		{ name: "コンピュータ概論", credits: 2, grade: "認", isIncludeInGPA: false, teacher: "" },
		{ name: "数学史", credits: null, grade: "G", isIncludeInGPA: true, teacher: "加藤 文元" },
	];

	expect(parseCoursesFromText(str).courses).toEqual(result);
})

test("parse course from text WITH EXTRA SECTION LABELS", () => {
	const str = `

a aさん
前回ログイン：2025/10/01 15:33

    setting
    setting setting
    setting
    favorite
    favorite favorite
    favorite
    logout
    logout logout
    logout

    共通
    履修関連
    成績
    Q&A
    WEB申請
    学修ポートフォリオ
    マイステップ登録
    リンク

    成績照会

成績照会[Kmg006]

表示パターン
    	
    まとめて表示
    	
    	
    年度学期表示
    昇順
    降順
表示対象列
    評価
    GPA対象
表示対象科目
    不合格科目
    履修中科目
    放棄科目

2025年度2Q
 	 科目	 単位数	 評価	 GPA対象	教員氏名
	導入				
	導入				
	導入科目				
	デジタルツールの使い方	2	A	○	津野 貴大
	経済入門	2	B	○	渡邉 聡
	多言語情報理解				
	多言語情報理解				
	基礎科目				
	多言語ITコミュニケーション	2	B	○	吉村 総一郎
	世界理解				
	文化・思想				
	基礎科目				
	心理学	2	B	○	積山 薫
	経済・マーケット				
	基礎科目				
	企業経営		G	○	上山 信一
	社会接続				
	社会接続				
	展開科目				
	ソーシャルイノベーション概論	2	A	○	鈴木 寛
2025年度1Q
 	 科目	 単位数	 評価	 GPA対象	教員氏名
	導入				
	導入				
	導入科目				
	アカデミックリテラシー	2	P		若山 正人
	ITリテラシー	2	B	○	吉村 総一郎
	人文社会入門		G	○	谷口 祐人
	基盤リテラシー				
	情報				
	基礎科目				
	情報セキュリティ概論		G	○	津野 貴大
	展開科目				
	コンピュータ概論	2	認		
	数理				
	基礎科目				
	数学史		G	○	加藤 文元
(注)科目名の先頭に※が出力された科目は現在履修中です。


GPA推移表
年度学期GPA
 	GPA
2025年度 2Q	2.8
2025年度 1Q	0.8
通算	2.0
年度学期GPA推移表
	通算GPA	
	GPA
※グラフは帳票出力されません。
年度GPA
 	GPA
2025年度	2.0
通算	2.0
年度GPA推移表
	通算GPA	
	GPA
※グラフは帳票出力されません。

単位修得状況
 科目分類	 修得済単位	 履修中単位	合計単位
導入	8	0	8
導入	8	0	8
導入科目	8	0	8
基盤リテ	2	0	2
情報	2	0	2
基礎科目	0	0	0
展開科目	2	0	2
展開考究	0	0	0
数理	0	0	0
基礎科目	0	0	0
展開科目	0	0	0
展開考究	0	0	0
多言語	2	0	2
多言語	2	0	2
基礎科目	2	0	2
展開科目	0	0	0
世界理解	2	0	2
文化思想	2	0	2
基礎科目	2	0	2
展開科目	0	0	0
展開考究	0	0	0
社会・ネ	0	0	0
基礎科目	0	0	0
展開科目	0	0	0
展開考究	0	0	0
経済・マ	0	0	0
基礎科目	0	0	0
展開科目	0	0	0
展開考究	0	0	0
デジ産	0	0	0
展開科目	0	0	0
展開考究	0	0	0
社会接続	2	0	2
社会接続	2	0	2
展開科目	2	0	2
展開考究	0	0	0
卒業プロ	0	0	0
卒業プロ	0	0	0
展開考究	0	0	0
自由	0	0	0
自由	0	0	0
自由科目	0	0	0
合計	16	0	16
履修合計単位	0
ZEN大学

サイトマップ

Copyright 2017 Japan System Techniques Co., Ltd. All rights reserved
`;

	const result: Course[] = [
		{
			name: "デジタルツールの使い方",
			credits: 2,
			grade: "A",
			isIncludeInGPA: true,
			teacher: "津野 貴大",
		},
		{
			name: "経済入門",
			credits: 2,
			grade: "B",
			isIncludeInGPA: true,
			teacher: "渡邉 聡",
		},
		{
			name: "多言語ITコミュニケーション",
			credits: 2,
			grade: "B",
			isIncludeInGPA: true,
			teacher: "吉村 総一郎",
		},
		{
			name: "心理学",
			credits: 2,
			grade: "B",
			isIncludeInGPA: true,
			teacher: "積山 薫",
		},
		{
			name: "企業経営",
			credits: null,
			grade: "G",
			isIncludeInGPA: true,
			teacher: "上山 信一",
		},
		{
			name: "ソーシャルイノベーション概論",
			credits: 2,
			grade: "A",
			isIncludeInGPA: true,
			teacher: "鈴木 寛",
		},
		{
			name: "アカデミックリテラシー",
			credits: 2,
			grade: "P",
			isIncludeInGPA: false,
			teacher: "若山 正人",
		},
		{
			name: "ITリテラシー",
			credits: 2,
			grade: "B",
			isIncludeInGPA: true,
			teacher: "吉村 総一郎",
		},
		{
			name: "人文社会入門",
			credits: null,
			grade: "G",
			isIncludeInGPA: true,
			teacher: "谷口 祐人",
		},
		{
			name: "情報セキュリティ概論",
			credits: null,
			grade: "G",
			isIncludeInGPA: true,
			teacher: "津野 貴大",
		},
		{
			name: "コンピュータ概論",
			credits: 2,
			grade: "認",
			isIncludeInGPA: false,
			teacher: "",
		},
		{
			name: "数学史",
			credits: null,
			grade: "G",
			isIncludeInGPA: true,
			teacher: "加藤 文元",
		},
	];

	expect(parseCoursesFromText(str).courses).toEqual(result);
});