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
                question_solved: [],
                scores: {
                    array:0,
                    hashmap:0,
                    linkedlist:0,
                    stack:0,
                    queue:0,
                    dynamicprogramming:0,
                }
            });
            console.log("User added to database successfully");
        } catch (error) {
            console.error("Error adding user to database:", error);
        }
}