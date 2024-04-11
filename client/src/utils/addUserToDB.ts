import { firestore } from "@/firebase/firebase";
import {doc,setDoc} from "firebase/firestore";

export async function addUserToDB(email: string, name: string, userid: string) {
        try {
            const uid = userid; 
            const doj = new Date().toLocaleDateString('en-GB'); 

            await setDoc(doc(firestore, "users", uid), {
                email: email,
                name: name,
                doj: doj,
                is_beginner:true,
                question_solved: [],
                initial_problem_count:0,
                question_stats: {"easy":0,"medium":0,"hard":0},
                scores: [
                    {
                        name: "array",
                        score: 0,
                    },
                    {
                        name: "hash table",
                        score: 0,
                    },
                    {
                        name: "string",
                        score: 0,
                    },
                    {
                        name: "sliding window",
                        score: 0,
                    },
                    {
                        name: "dynamic programming",
                        score: 0,
                    },
                    {
                        name: "recursion",
                        score: 0,
                    },
                    {
                        name: "math",
                        score: 0,
                    },
                    {
                        name: "bit manipulation",
                        score: 0,
                    },
                    {
                        name: "two pointers",
                        score: 0,
                    },
                    {
                        name: "greedy",
                        score: 0,
                    },
                    {
                        name: "sorting",
                        score: 0,
                    },
                    {
                        name: "stack",
                        score: 0,
                    },
                    {
                        name: "backtracking",
                        score: 0,
                    },
                    {
                        name: "binary search",
                        score: 0,
                    },
                    {
                        name: "matrix",
                        score: 0,
                    },
                    {
                        name: "simulation",
                        score: 0,
                    },
                    {
                        name: "divide and conquer",
                        score: 0,
                    },
                    {
                        name: "monotonic stack",
                        score: 0,
                    },
                    {
                        name: "union find",
                        score: 0,
                    },
                    {
                        name: "depth-first search",
                        score: 0,
                    },
                    {
                        name: "breadth-first search",
                        score: 0,
                    },
                    {
                        name: "trie",
                        score: 0,
                    },
                    {
                        name: "geometry",
                        score: 0,
                    },
                    {
                        name: "bucket sort",
                        score: 0,
                    },
                    {
                        name: "radix sort",
                        score: 0,
                    },
                    {
                        name: "rolling hash",
                        score: 0,
                    },
                    {
                        name: "hash function",
                        score: 0,
                    },
                    {
                        name: "shell",
                        score: 0,
                    },
                    {
                        name: "linked list",
                        score: 0,
                    },
                    {
                        name: "enumeration",
                        score: 0,
                    },
                    {
                        name: "number theory",
                        score: 0,
                    },
                    {
                        name: "graph",
                        score: 0,
                    },
                    {
                        name: "topological sort",
                        score: 0,
                    },
                    {
                        name: "quickselect",
                        score: 0,
                    },
                    {
                        name: "binary indexed tree",
                        score: 0,
                    },
                    {
                        name: "segment tree",
                        score: 0,
                    },
                    {
                        name: "line sweep",
                        score: 0,
                    },
                    {
                        name: "prefix sum",
                        score: 0,
                    },
                    {
                        name: "heap (priority queue)",
                        score: 0,
                    },
                    {
                        name: "ordered set",
                        score: 0,
                    },
                    {
                        name: "binary tree",
                        score: 0,
                    },
                    {
                        name: "binary search tree",
                        score: 0,
                    },
                    {
                        name: "monotonic queue",
                        score: 0,
                    },
                    {
                        name: "queue",
                        score: 0,
                    },
                    {
                        name: "interactive",
                        score: 0,
                    },
                    {
                        name: "database",
                        score: 0,
                    }
                ]
                
            });
            console.log("User added to database successfully");
        } catch (error) {
            console.error("Error adding user to database:", error);
        }
}