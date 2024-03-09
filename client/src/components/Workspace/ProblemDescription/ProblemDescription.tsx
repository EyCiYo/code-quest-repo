import { DBProblem } from "@/utils/types";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { FaFlagCheckered } from "react-icons/fa";
import parse from 'html-react-parser';
import { User } from "firebase/auth";

type ProblemDescriptionProps = {
    questiondata: DBProblem | null;
    user: User | null| undefined;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ questiondata },{user}) => {
    const difficultyTextColor = questiondata?.difficulty == "Easy" ? "text-dark-green-s" : questiondata?.difficulty == "Medium" ? "text-dark-yellow" : "text-dark-pink";
    const difficultyBGColor = questiondata?.difficulty == "Easy" ? "bg-green-600" : questiondata?.difficulty == "Medium" ? "bg-yellow-600" : "bg-red-600";
    const questionDoneColor = user ? "text-green-s" : "text-dark-gray-6";
    return (
        <div className="bg-dark-layer-1">
            {/* TAB */}
            {/* <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
                <div
                    className={
                        "bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"
                    }
                >
                    Description
                </div>
            </div> */}
            <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
                <div className="px-5">
                    {/* Problem heading */}
                    <div className="w-full">
                        <div className="flex space-x-4">
                            <div className="flex-1 mr-2 text-lg text-white font-medium">
                                {/* Title */}
                                {questiondata?.title}
                            </div>
                        </div>
                        <div className="flex items-center mt-3">
                            <div
                                className={`${difficultyTextColor} ${difficultyBGColor} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
                            >
                                {/* Difficulty */}
                                {questiondata?.difficulty}
                            </div>
                            <div className={` ${questionDoneColor} rounded p-[3px] ml-4 text-lg transition-colors duration-200`}>
                                <FaFlagCheckered />
                            </div>
                            {/* <div className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6">
                                <AiFillLike />
                                <span className="text-xs">120</span>
                            </div>
                            <div className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6">
                                <AiFillDislike />
                                <span className="text-xs">2</span>
                            </div>
                            <div className="cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 ">
                                <TiStarOutline />
                            </div> */}
                        </div>

                        {/* Problem Statement(paragraphs) */}
                        <div className="text-white text-sm" >
                            {parse(questiondata?.text as string)}
                        </div>

                        {/* Examples */}
                        <div className="mt-4">
                            {/* Example 1 */}
                            <div>
                                <p className="font-medium text-white ">
                                    Example 1:{" "}
                                </p>
                                <div className="example-card">
                                    <pre>
                                        <strong className="text-white">
                                            Input:</strong> nums = 3<br />
                                        <strong>Output:</strong> "III" <br />
                                        <strong>Explanation:</strong> Because the number 5 is represented as three 'I's.
                                    </pre>
                                </div>
                            </div>
                            <div>
                                <p className="font-medium text-white ">
                                    Example 2:{" "}
                                </p>
                                <div className="example-card">
                                    <pre>
                                        <strong className="text-white">
                                            Input: 
                                        </strong> nums = 4
                                        <br />
                                        <strong>Output:</strong> "IV" <br />
                                        <strong>Explanation:</strong> V = 5, I = 1. So, 4 is 5 - 1 = 4.
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Constraints */}
                        <div className="my-5 pb-2">
                            <div className="text-white text-sm font-medium">
                                Constraints:
                            </div>
                            <ul className="text-white ml-5 list-disc" >
                                {parse(questiondata?.constraints as string)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProblemDescription;
