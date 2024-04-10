import { DBProblem } from "@/utils/types";
import React, { useEffect, useState,useRef } from "react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type FeedbackProps = {
    dataFromPG: string;
    questiondata: DBProblem | null;
};

const Feedback: React.FC<FeedbackProps> =  ({ dataFromPG, questiondata }) => {
    const removeCode = (content: string) => {
        return content.replace(/```[\s\S]*?```/g, "");
    }
    const sourceCode = dataFromPG;
    //console.log('Source code:', sourceCode);
    const [lines, setLines] = useState("");
    const isMounted = useRef(false);
    useEffect(() => {
        if(isMounted.current){
            if(sourceCode === "") return;
            const fetchData = async () => {
                setLines("");
                try{
                    const res = await fetch("/api/submit", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ content: sourceCode }),
                    });
                    if(!res || !res.body){
                        throw new Error('Failed to fetch data from model');
                    }
                    const reader = res.body.getReader();
                    const decoder = new TextDecoder();
                    while(true){
                        const {value,done} = await reader.read(); 
                        const text = decoder.decode(value);
                        console.log('Text:', text);
                        setLines(curValue => curValue + text);
                        if(done){
                            break;
                        }
                    }
                }
                catch(error){
                    console.error('An error occurred while fetching data from model:', error);
                }
            }
            fetchData();
        }
        else{
            isMounted.current = true;
        }

    },[dataFromPG]);

    return (
        <div className="bg-dark-layer-1">
            {/* Other JSX elements */}
            <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
                <div className="px-5">
                    <div className="w-full text-white prose dark:prose-invert">
                        <Markdown remarkPlugins={[remarkGfm]}>{lines}</Markdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
