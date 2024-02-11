import { firestore } from "@/firebase/firebase"; 
import { DBProblem } from "@/utils/types";
import { doc, getDoc} from "firebase/firestore";

export async function getQuestionData(questionId: string) {
  try {
    const docRef = doc(firestore, 'questions', questionId);
    const docSnap = await getDoc(docRef);
    const questionData: DBProblem = docSnap.data() as DBProblem;
    console.log('Question data:', questionData);
    return questionData;
  } catch (error) {
    console.error('Error getting question data:', error);
    return null;
  }
}
