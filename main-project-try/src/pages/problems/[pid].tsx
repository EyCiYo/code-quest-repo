import React from "react";
import Topbar from "../../components/Topbar/Topbar";
import Workspace from "@/components/Workspace/Workspace";

type ProblemPageProps = {};

const ProblemPage: React.FC<ProblemPageProps> = () => {
    return (
        <div>
            <Topbar problemPage={false} />
            <Workspace />
        </div>
    );
};
export default ProblemPage;
