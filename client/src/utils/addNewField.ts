import { firestore } from "@/firebase/firebase";
import { getDocs,collection,updateDoc,arrayUnion } from "firebase/firestore";

export async function addNewField(){
    const db = firestore;
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach(async (doc) => {
            try {
                // Update each document to add the new fields
                await updateDoc(doc.ref, {
                  initial_test_questions: ["two-sum","integer-to-roman","longest-palindromic-substring","search-insert-position"], // Add initial test questions as an empty array
                  questions_to_display: arrayUnion() // Add questions to display as an empty array
                });
                console.log(`Document ${doc.id} updated successfully.`);
              } catch (error) {
                console.error(`Error updating document ${doc.id}: ${error}`);
              }
            
        });
    } catch (error) {
        console.error("Error adding question to database:", error);
    }
}