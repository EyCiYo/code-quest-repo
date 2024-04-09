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
                        name: "string",
                        score: 0,
                    },
                    {
                        name: "math",
                        score: 0,
                    },
                    {
                        name: "dynamic programming",
                        score: 0,
                    },
                    {
                        name: "binary search",
                        score: 0,
                    },
                    {
                        name: "hash table",
                        score: 0,
                    },
                ]
            });
            console.log("User added to database successfully");
        } catch (error) {
            console.error("Error adding user to database:", error);
        }
}