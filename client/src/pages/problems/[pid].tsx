import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Topbar from "../../components/Topbar/Topbar";
import Workspace from "@/components/Workspace/Workspace";
import { DBProblem, UserStruct } from "@/utils/types";
import { getQuestionData } from "../../utils/questionAPI";
import PageLoading from "@/components/Modals/PageLoading";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { getUserData } from "@/utils/userDataFetch";

type ProblemPageProps = {};

const ProblemPage: React.FC<ProblemPageProps> = () => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const { pid } = router.query;
    const problemId = pid as string;
    const [question, setQuestion] = useState<DBProblem | null>(null);
    const [usermetadata, setUserData] = useState<UserStruct|null>(null);
    console.log("User in pid:  ",user);
    console.log("User data in pid:  ",usermetadata);
    useEffect(() => {
        if(pid)
        {
            getQuestionData(problemId).then((data) => {
                setQuestion(data);
            }).catch((error) => {  
                console.error('Error getting question data:', error);
            });
        }
        if(user)
        {
            getUserData(user.uid).then((data) => {
                setUserData(data);
            }).catch((error) => {  
                console.error('Error getting user data:', error);
            });
        }
    }, [pid,user]);
    return (
        <div>
            <Topbar problemPage={false} />
            {question?(<Workspace questiondata={question} userdata={usermetadata}/>):(<div><PageLoading/></div>)}
        </div>
    );
};
export default ProblemPage;
