import { DBProblem, topicArray, UserStruct } from './types';
import { firestore } from '@/firebase/firebase';
import { getDoc,getDocs, collection, updateDoc,doc,arrayUnion } from 'firebase/firestore';

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
        const filteredTopicArray: topicArray = Object.fromEntries(
            Object.entries(topic_array).filter(([_, value]) => value !== 0)
        );
        //console.log('Question data:', questionData);
    
        if (userDoc.exists()) 
        {
            const userData = userDoc.data() as UserStruct;
            //console.log('User data:', userData);
            let new_questions:string[] = [];
            let done_questions = userData.question_solved;
            questionData = questionData.filter((ques) => !done_questions.includes(ques.id));
            questionData = questionData.filter((ques) => {
                const topics = ques.topics.split(',').map(topic => topic.trim().toLowerCase());
                return topics.some(topic => filteredTopicArray.hasOwnProperty(topic));
            });
            console.log('Filtered topic_array:', filteredTopicArray);
            for (const topic in filteredTopicArray){
                if(new_questions.length >= maxLength)
                    break;
                for(let i = 0; i < filteredTopicArray[topic]; i++){
                    console.log('Topic:',topic);
                    questionData.forEach((ques) => {
                        const topic_cap = capitalizeFirstLetter(topic);
                        if (ques.topics.includes(topic_cap) && !new_questions.includes(ques.id) && !done_questions.includes(ques.id)) {
                            new_questions.push(ques.id);
                        }
                    });
                }
                // console.log('New questions:', new_questions);
            };
            if (new_questions.length > maxLength) {
                new_questions = new_questions.slice(0, maxLength);
            }
            try{
                await updateDoc(userRef, {
                    questions_to_display: new_questions,
                });
                console.log('Questions to display updated successfully',userData.questions_to_display);
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