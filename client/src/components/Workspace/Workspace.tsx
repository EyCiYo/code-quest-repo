import React from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Playground from "./Playground/Playground";
import Feedback from "./Feedback/Feedback";
import { DBProblem } from "@/utils/types";

type WorkspaceProps = {
  questiondata: DBProblem|null;
};

const Workspace: React.FC<WorkspaceProps> = ({questiondata}) => {
  return (
    <Split className="split" minSize={0}>
      <ProblemDescription questiondata={questiondata}/>
      <Playground questiondata={questiondata} />
    </Split>
  );
};
export default Workspace;
