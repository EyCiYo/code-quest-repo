import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";

type QuestionStats = {
    easy: number;
    medium: number;
    hard: number;
};

export async function updateQuestionStatus(uid: string, newStats: QuestionStats) {
    const db = firestore;
    try {
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const existingStats: QuestionStats = userDoc.data()?.question_stats || { easy: 0, medium: 0, hard: 0 };

            // Merge the new stats with existing stats
            const mergedStats = {
                easy:  newStats.easy,
                medium:  newStats.medium,
                hard: newStats.hard,
            };

            await setDoc(userRef, { question_stats: mergedStats }, { merge: true });
            console.log("User Question Stats Updated successfully");
        } else {
            // If the document doesn't exist, create it with the new stats
            await setDoc(userRef, { question_stats: newStats });
            console.log("User Question Stats Document Created successfully");
        }
    } catch (error) {
        console.error("Error updating user question stats:", error);
    }
}
