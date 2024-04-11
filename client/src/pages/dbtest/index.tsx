"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtoms';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { updateQuestionsSolved } from '@/utils/updateQuestionsSolved';
import { updateUserScore } from '@/utils/updateUserScore';
import { addNewField } from '@/utils/addNewField';
import { updateQuestionsDisplay } from '@/utils/updateQuestionDisplay';

type indexProps = {
    
};

const index:React.FC<indexProps> = () => {
    
    const [user] = useAuthState(auth);
    const setAuthModalState = useSetRecoilState(authModalState);
    const userid = user?.uid;
    const [questionId, setQuestionId] = useState('');

    const handleUpdateQuestion = () => {
        console.log(questionId);
        updateQuestionsSolved(userid as string, questionId);
    }

    console.log(user?.uid);
    const newScore = [
        {
            name: 'Array',
            score: 40
        },
        {
            name: 'Linked List',
            score: 20
        }
    ]
    const handleUpdateScore = () => {
        updateUserScore(userid as string,newScore);
    }

    const handleUpdateQuestionDisplay = () => {
        const topicArray = {
            'array':1,
            'hash table':1
        }
        updateQuestionsDisplay(userid as string,topicArray);
    }


    return(
        <>
            {!user && <Link
                            href="/auth"
                            onClick={() => {
                                setAuthModalState((prev) => ({
                                    ...prev,
                                    isOpen: true,
                                    type: "login",
                                }));
                            }}
                        >
                            <button className="bg-dark-fill-3 py-1 px-2 cursor-pointer rounded ">
                                Sign In
                            </button>
                        </Link>}
            {user && <div>
            <label htmlFor='qid'>Enter question id</label>
            <input
                type="text"
                placeholder="Enter question id"
                id='qid'
                value={questionId}
                onChange={(e) => setQuestionId(e.target.value)}
            />
            <div className='flex flex-col gap-3 p-5'>
                <button onClick={handleUpdateQuestion} className='border border-solid bg-red-400'>Update question solved</button> 
                <button onClick={handleUpdateScore} className='border border-solid'>update scores</button>
                <button onClick={addNewField} className='border border-solid'>Add new Field</button>
                <button onClick={handleUpdateQuestionDisplay} className='border border-solid'>Question display test</button>
            </div>
        </div>}

        </>
        
    );
}
export default index;