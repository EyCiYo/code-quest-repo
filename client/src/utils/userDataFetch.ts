import { firestore } from "@/firebase/firebase";
import { doc, getDoc} from "firebase/firestore";
import {UserStruct} from "@/utils/types";

export async function getUserData(userid:string) {
    const docRef = doc(firestore, 'users', userid);
    const docSnap = await getDoc(docRef);
    const userData: UserStruct = docSnap.data() as UserStruct;
    console.log('User data:', userData);
}