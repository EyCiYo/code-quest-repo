import React, { useState } from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Playground from "./Playground/Playground";
import Feedback from "./Feedback/Feedback";
import { DBProblem, UserStruct } from "@/utils/types";
import { User } from "firebase/auth";
import { getUserData } from "@/utils/userDataFetch";

type WorkspaceProps = {
  questiondata: DBProblem | null;
};


const Workspace: React.FC<WorkspaceProps> = ({ questiondata }) => {

  const [showDescription, setShowDescription] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showColor,setShowColor] = useState(1);
  const [dataFromPG,setDataFromPG] = useState<string>('');
  const [userId,setUserId]=useState('');


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
          <div
            className={
              `bg-dark-layer-${showColor?2:1} rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer ml-1`
            }
            onClick={feedback}
          >
            Feedback
          </div>
        </div>
        {showDescription && <ProblemDescription questiondata={questiondata} getUserId={handleUserId}/>}
        {showFeedback && <Feedback dataFromPG={dataFromPG}/>}
      </div>

      <Playground questiondata={questiondata} sendDataToWS={handleDataFromPG} userIdFromProblem={userId}/>
    </Split>
  );
  
};
export default Workspace;
