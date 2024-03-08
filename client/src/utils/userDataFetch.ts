import { firestore } from "@/firebase/firebase";
import { doc, getDoc} from "firebase/firestore";
import {UserStruct} from "@/utils/types";

export async function getUserData(username:string) {
    const docRef = doc(firestore, 'user', username);
    const docSnap = await getDoc(docRef);
    const userData: UserStruct = docSnap.data() as UserStruct;
    console.log('User data:', userData);
}