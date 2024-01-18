import React from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Playground from "./Playground/Playground";
import Feedback from "./Feedback/Feedback";

type WorkspaceProps = {};

const Workspace: React.FC<WorkspaceProps> = () => {
    return (
        <Split className="split" minSize={0}>
            <Feedback />
            <Playground />
        </Split>
    );
};
export default Workspace;
