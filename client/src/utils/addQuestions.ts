import { doc, setDoc, getDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { DBProblem } from "./types";

type Score = { name: string; score: number }[];


export async function addQuestionsFromCSV() {
  const db = firestore;
  try {
            
  } catch (error) {
    console.error("Error adding questions from CSV:", error);
  }
}

// Helper function to decode base64 encoded text into an array of maps
function decodeBase64ToTestCases(base64String: string): Array<{ input: string; output: string }> {
  const decodedString = Buffer.from(base64String, 'base64').toString('utf-8');
  const testCasesArray = JSON.parse(decodedString);
  return testCasesArray;
}
