import { firestore } from "@/firebase/firebase";
import { doc, getDoc} from "firebase/firestore";
import {UserStruct} from "@/utils/types";

export async function getUserData(userid:string){
    try{
        const docRef = doc(firestore, 'users', userid);
        const docSnap = await getDoc(docRef);
        const userData: UserStruct = docSnap.data() as UserStruct;
        //console.log('User data fetched at userDataFetch.ts:', userData);
        return userData;
    }
    catch(error){
        console.error('Error getting user data:', error);
        return null;
    }
}