import { DBProblem } from "@/utils/types";
import React, { useEffect, useState, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { convertToScoresObject, setScoreOnSubmit } from "../../../../model";
import { updateQuestionsDisplay } from "@/utils/updateQuestionDisplay";
import { getRecommendQuestions } from "../../../../model";
import { get } from "http";
import { getUserData } from "@/utils/userDataFetch";

type FeedbackProps = {
  dataFromPG: string;
  questiondata: DBProblem | null;
  testScore: number;
  isFullPass: boolean;
  userId: string;
};

const Feedback: React.FC<FeedbackProps> = ({
  dataFromPG,
  questiondata,
  testScore,
  isFullPass,
  userId,
}) => {
  const getScore = (feedback: string) => {
    const last = "/10";
    const indexLast = feedback.indexOf(last);
    const first = "Score: ";
    const indexFirst = feedback.indexOf(first);
    return parseInt(feedback.substring(indexFirst + first.length, indexLast));
  };

  const getFeedback = (feedback: string) => {
    console.log("inside fn test", feedback);
    const first = "Score: ";
    const indexOfScore = feedback.indexOf(first);
    console.log("inside fn", feedback.substring(0, indexOfScore));
    return feedback.substring(0, indexOfScore);
  };

  const removeCode = (content: string) => {
    return content.replace(/```[\s\S]*?```/g, "");
  };
  const sourceCode = dataFromPG;
  //console.log('Source code:', sourceCode);
  const [lines, setLines] = useState("");
  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) {
      if (sourceCode === "") return;
      const fetchData = async () => {
        setLines("");
        try {
          const res = await fetch("/api/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: sourceCode }),
          });
          if (!res || !res.body) {
            throw new Error("Failed to fetch data from model");
          }
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let text = "";
          while (true) {
            const { value, done } = await reader.read();
            text = decoder.decode(value);
            //console.log('Text:', text);
            const feedbackOnly = getFeedback(text);
            //console.log('Feedback:', feedbackOnly);
            setLines((curValue) => curValue + feedbackOnly);
            if (done) {
              break;
            }
          }
          if (isFullPass) {
            const feedbackScore = getScore(text);
            setScoreOnSubmit(
              questiondata,
              userId,
              feedbackScore,
              testScore,
              isFullPass
            );
            let userInfo = await getUserData(userId);
            if (userInfo) {
              const userscores = convertToScoresObject(userInfo.scores);
              const recomendedquestions = getRecommendQuestions(userscores);
              console.log("Recommended Questions:", recomendedquestions);
              updateQuestionsDisplay(userId, recomendedquestions);
            }

            // just a comment
          }
        } catch (error) {
          console.error(
            "An error occurred while fetching data from model:",
            error
          );
        }
      };
      fetchData();
    } else {
      isMounted.current = true;
    }
  }, [dataFromPG]);

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
