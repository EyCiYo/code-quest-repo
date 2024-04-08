import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";

export async function updateBeginnerStatus(uid: string) {
    const db = firestore;
    try {
        const userRef = doc(db, "users", uid);
        // Update the beginner field to false
        await updateDoc(userRef, {
            is_beginner: false
        });
        console.log("User beginner status updated successfully");
    } catch (error) {
        console.error("Error updating user beginner status:", error);
    }
}
