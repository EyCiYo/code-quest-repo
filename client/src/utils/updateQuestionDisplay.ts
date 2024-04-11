import { DBProblem, topicArray, UserStruct } from './types';
import { firestore } from '@/firebase/firebase';
import { getDoc,getDocs, collection, updateDoc,doc } from 'firebase/firestore';

function capitalizeFirstLetter(name:string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

export async function updateQuestionsDisplay(uid: string, topic_array:topicArray ) {
    const db = firestore;
    const maxLength = 10;
    try 
    {
        
        console.log('Inside updateQuestionsDisplay',topic_array);
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);
        const questions = await getDocs(collection(db, "questions"));
        let questionData: DBProblem[] = [];
        questions.forEach((doc) => {
            questionData.push(doc.data() as DBProblem);
        });

        console.log('Question data:', questionData);
    
        if (userDoc.exists()) 
        {
            const userData = userDoc.data() as UserStruct;
            console.log('User data:', userData);
            let new_quesions = userData.questions_to_display;
            let done_questions = userData.question_solved;
            for (const topic in topic_array){
                for(let i = 0; i < topic_array[topic]; i++){
                    console.log('Topic:',topic);
                    questionData.forEach((ques) => {
                        const topic_cap = capitalizeFirstLetter(topic);
                        if (ques.topics.includes(topic_cap) && !new_quesions.includes(ques.id) && !done_questions.includes(ques.id)) {
                            new_quesions.push(ques.id);
                        }
                    });
                }
                console.log('New questions:', new_quesions);
            };
            if (new_quesions.length > maxLength) {
                new_quesions = new_quesions.slice(0, maxLength);
            }
            try{
                await updateDoc(userRef, {
                    questions_to_display: new_quesions,
                });
            }
            catch (error) {
                console.error('Error updating questions to display:', error);
            }
            
        } 
        else
        {
            throw new Error('User not found');
        }
    } 
    catch (error) 
    {
        console.error('Error updating question display:', error);
    }
};