import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Topbar from "../../components/Topbar/Topbar";
import Workspace from "@/components/Workspace/Workspace";
import { DBProblem } from "@/utils/types";
import { getQuestionData } from "../../utils/questionAPI";
import PageLoading from "@/components/Modals/PageLoading";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";

type ProblemPageProps = {};

const ProblemPage: React.FC<ProblemPageProps> = () => {
    const [user] = useAuthState(auth);
    console.log(user);
    const router = useRouter();
    const { pid } = router.query;
    const problemId = pid as string;
    const [question, setQuestion] = useState<DBProblem | null>(null);

    useEffect(() => {
        if(pid)
        {
            getQuestionData(problemId).then((data) => {
                setQuestion(data);
            }).catch((error) => {  
                console.error('Error getting question data:', error);
            });
        }
    }, [pid]);
    return (
        <div>
            <Topbar problemPage={false} />
            {question?(<Workspace questiondata={question} user={user}/>):(<div><PageLoading/></div>)}
        </div>
    );
};
export default ProblemPage;
