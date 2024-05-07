import React, { useState } from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Playground from "./Playground/Playground";
import Feedback from "./Feedback/Feedback";
import { DBProblem, UserStruct } from "@/utils/types";
import { User } from "firebase/auth";
import { getUserData } from "@/utils/userDataFetch";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";

type WorkspaceProps = {
  questiondata: DBProblem | null;
};


const Workspace: React.FC<WorkspaceProps> = ({ questiondata }) => {

  const [showDescription, setShowDescription] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showColor,setShowColor] = useState(1);
  const [dataFromPG,setDataFromPG] = useState<string>('');
  const [userId,setUserId]=useState('');
  const [testScore,setTestscore] = useState<number>(0);
  const [fullTestPass,setFullTestPass] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserStruct | null>(null);
  const [user] = useAuthState(auth);
  useEffect(() => {
    if (user){
      getUserData(user.uid)
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error("Error getting user data:", error);
        });
      }
  }, [user]);

  const problemDescription = () => {
    setShowDescription(true);
    setShowFeedback(false);
    setShowColor(1);
  };

  const feedback = () => {
    setShowFeedback(true);
    setShowDescription(false);
    setShowColor(0);
  };

  const handleDataFromPG = (data:string)=>{
    setDataFromPG(data);
  }
  const handleUserId = (data:string)=>{
    setUserId(data);
  }
  const handleTestScore = (data:number)=>{
    setTestscore(data);
  }

  // const handleFullPass = (data:boolean)=>{
  //   console.log('workspace Full pass:',data);
  //   setFullTestPass(data);
  // }

  return (
    <Split className="split" sizes={[50, 50]}>
      <div>
        <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
          <div
            className={
              `bg-dark-layer-${showColor?1:2} rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer`
            }
            onClick={problemDescription}
          >
            Description
          </div>
          {!userData?.is_beginner&&<div
            className={
              `bg-dark-layer-${showColor?2:1} rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer ml-1`
            }
            onClick={feedback}
          >
            Feedback
          </div>}
        </div>
        {showDescription && <ProblemDescription questiondata={questiondata} getUserId={handleUserId}/>}
        {showFeedback &&  <Feedback dataFromPG={dataFromPG} questiondata={questiondata} testScore={testScore} userId = {userId}/>}
      </div>

      <Playground questiondata={questiondata} sendDataToWS={handleDataFromPG} userIdFromProblem={userId} toggleFeedback={feedback} testScore={handleTestScore}/>
    </Split>
  );
  
};
export default Workspace;
