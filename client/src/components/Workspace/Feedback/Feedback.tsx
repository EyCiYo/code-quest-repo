import React from "react";

type FeedbackProps = {
    dataFromPG:string;
};

const Feedback: React.FC<FeedbackProps> = ({dataFromPG}) => {
    var lines= new Array;
    function callMe(){
        lines = dataFromPG.split('\n');
    }
    callMe();
    return (
        <div className="bg-dark-layer-1">
            {/* TAB */}
            {/* <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
                <div
                    className={
                        "bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"
                    }
                >
                    Feedback
                </div>
            </div> */}

            <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
                <div className="px-5">
                    <div className="w-full text-white">
                    {
                        lines.map((statement, index) => (
                            <p key={index}>{statement.trim()}</p>
                        ))
                    }
                    </div>
                   
                </div>
            </div>
        </div>
    );
};
export default Feedback;
