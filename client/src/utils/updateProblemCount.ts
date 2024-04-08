import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";

export async function updateProblemCount(uid: string, newProblemCount: number) {
    const db = firestore;
    try {
        const userRef = doc(db, "users", uid);
        // Update the problem_count field with the new value
        await updateDoc(userRef, {
            initial_problem_count: newProblemCount
        });
        console.log("User problem count updated successfully");
    } catch (error) {
        console.error("Error updating user problem count:", error);
    }
}
