import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";

export async function updateQuestionsSolved(uid: string, question_id: string) {
    const db = firestore;
    try {
        const userRef = doc(db, "users", uid);
        // Use arrayUnion to append the new question_id to the existing array
        await updateDoc(userRef, {
            question_solved: arrayUnion(question_id)
        });
        console.log("Question added to database successfully");
    } catch (error) {
        console.error("Error adding question to database:", error);
    }
}
