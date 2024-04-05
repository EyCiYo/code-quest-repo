import { doc, setDoc, getDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";

type Score = { name: string; score: number }[];

export async function updateUserScore(uid: string, newScoreArray: Score) {
    const db = firestore;
    try {
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const existingScores: Score = userDoc.data()?.scores || [];

            {/* Takes each element in newScoreArray and check if it exists in existingScores array.
                If it exists and the scores are different, the score field is updated. If the element 
                doesnot exist in existingScore array, it is pushed to mergedScores */}
            const mergedScores = newScoreArray.map((newScore) => {
                const existingScore = existingScores.find(
                    (score) => score.name === newScore.name
                );
                console.log("Existing score: ", existingScore);
                if (existingScore && existingScore.score !== newScore.score) {
                    return {
                        name: newScore.name,
                        score: newScore.score,
                    };
                } else{
                    return newScore;
                }
            });

            {/* Pushes any elements that are left over in the existingScores into mergedScores*/}
            for (let i = 0; i < existingScores.length; i++) {
                if((newScoreArray.find((nScore) => nScore.name === existingScores[i].name)) === undefined){
                    mergedScores.push(existingScores[i]);
                }
            }
            await setDoc(userRef, { scores: mergedScores }, { merge: true });
            console.log("User Scores Updated successfully");
        } else {
            // If the document doesn't exist, create it with the new score array
            await setDoc(userRef, { scores: newScoreArray });
            console.log("User Scores Document Created successfully");
        }
    } catch (error) {
        console.error("Error updating user scores:", error);
    }
}
