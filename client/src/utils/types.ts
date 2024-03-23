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
    question_solved: string[];
    scores: {
        [topic: string]: number;
    };
}

