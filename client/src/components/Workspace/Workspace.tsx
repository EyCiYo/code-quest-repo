import React from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Playground from "./Playground/Playground";
import Feedback from "./Feedback/Feedback";
import { DBProblem } from "@/utils/types";
import { User } from "firebase/auth";

type WorkspaceProps = {
  questiondata: DBProblem|null;
  user:User | null | undefined;
};

const Workspace: React.FC<WorkspaceProps> = ({questiondata},{user}) => {
  return (
    <Split className="split" minSize={0}>
      <ProblemDescription questiondata={questiondata} user={user}/>
      <Playground questiondata={questiondata} />
    </Split>
  );
};
export default Workspace;
