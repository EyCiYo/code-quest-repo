import React, { useEffect } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtoms';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { updateQuestionsSolved } from '@/utils/updateQuestionsSolved';
import { updateUserScore } from '@/utils/updateUserScore';

type indexProps = {
    
};

const index:React.FC<indexProps> = () => {
    
    const [user] = useAuthState(auth);
    const [isUser,setIsUser] = useState(false);
    const setAuthModalState = useSetRecoilState(authModalState);
    const userid = user?.uid;
    const router = useRouter();
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
            <button className='border border-solid bg-red-400'>Add question details</button>
            <label htmlFor='qid'>Enter question id</label>
            <input
                type="text"
                placeholder="Enter question id"
                value={questionId}
                onChange={(e) => setQuestionId(e.target.value)}
            />
            <button onClick={handleUpdateQuestion} className='border border-solid bg-red-400'>Update question data</button> 
            <br></br>
            <button onClick={handleUpdateScore} className='border border-solid'>update scores</button>
        </div>}

        </>
        
    );
}
export default index;