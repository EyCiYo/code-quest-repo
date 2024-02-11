export type Problem = {
	id: string;
	title: string;
	difficulty: string;
	category: string;
	order: number;
	videoId?: string;
};

export const problems: Problem[] = [
	{
		id: "two-sum",
		title: "Two Sum",
		difficulty: "Easy",
		category: "Array, Hash Table",
		order: 1,
		videoId: "8-k1C6ehKuw",
	},
	{
		id: "integer-to-roman",
		title: "Integer to Roman",
		difficulty: "Medium",
		category: "Hash Table, Math, String",
		order: 2,
		videoId: "",
	},
	{
		id: "longest-palindromic-substring",
		title: "Longest Palindromic Substring",
		difficulty: "Medium",
		category: "String, Dynamic Programming",
		order: 3,
		videoId: "",
	},
	{
		id: "search-insert-position",
		title: "Search Insert Position",
		difficulty: "Easy",
		category: "Array, Binary Search",
		order: 4,
		videoId: "xty7fr-k0TU",
	}
];