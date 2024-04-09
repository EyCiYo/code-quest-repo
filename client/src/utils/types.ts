export type DBProblem = {
	id: string;
	title: string;
    text:string;
	topics: string;
	difficulty: string;
	boilerplate_cpp: string;
    driver_cpp: string;
    header_cpp: string;
    boilerplate_py: string;
    driver_py: string;
    examples:string;
    constraints:string;
    testcases : {
        input: string;
        output: string;
    }[];
};

export type UserStruct = {
    email: string;
    name: string;
    doj: string;
    is_beginner:boolean;
    initial_problem_count:number;
    question_solved: string[];
    question_stats: {
        [key:string]: number
    };
    scores: [
        {
            name: string;
            score: number;
        }
    ];
}

