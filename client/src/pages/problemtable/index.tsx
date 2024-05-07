import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Topbar from "@/components/Topbar/Topbar";
import { auth } from "@/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { DBProblem, UserStruct } from "@/utils/types";
import { getUserData } from "@/utils/userDataFetch";
import PageLoading from "@/components/Modals/PageLoading";
import { getQuestionData } from "@/utils/questionAPI";
import { convertToScoresObject } from "../../../model";
import { getRecommendQuestions } from "../../../model";
import { updateQuestionsDisplay } from "@/utils/updateQuestionDisplay";

interface ProblemTableProps {}

const stripNumber = (title: string) => {
  const regex = /^\d+\.\s/;
  const match = title.match(regex);
  const number = match ? match[0].replace(/\D/g, "") : "";
  const strippedTitle = title.replace(regex, "");
  return { number, strippedTitle };
};

const ProblemTable: React.FC<ProblemTableProps> = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserStruct | null>(null);
  const [problems, setProblems] = useState<DBProblem[]>([]);
  const [headingText, setHeadingText] = useState<string>("");

  // Reload page on back button press is acheived with this useEffect
  useEffect(() => {
    setIsLoading(true);
    const handleBackButton = (event:any) => {
      if (event.state && event.state.page === 'problemtable') {
        window.location.reload();
      }
    };
    window.onpopstate = handleBackButton;
    return () => {
      window.onpopstate = null;
    };
    setIsLoading(false);
  }, []);


  useEffect(() => {
    if (!user) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      getUserData(user.uid)
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error("Error getting user data:", error);
        });
    }
    const fetchData = async () => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          if(!data)
            return
          if (data?.question_solved.length >= 4) {
            const userscores = convertToScoresObject(data?.scores);
            const recomendedquestions = getRecommendQuestions(userscores);
            updateQuestionsDisplay(user.uid, recomendedquestions);
          }
        } catch (error) {
          console.error("Error getting user data:", error);
        }
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (userData) {
        const heading = userData.is_beginner
          ? "Solve this Initial Test to begin learning"
          : "Here are some questions for you to solve";
        setHeadingText(heading);

        const questionsToShow = userData.is_beginner
          ? userData.initial_test_questions
          : userData.questions_to_display;

        const fetchedProblems: DBProblem[] = [];
        for (const question of questionsToShow) {
          const questionData = await getQuestionData(question);
          if (questionData) {
            fetchedProblems.push(questionData);
          }
        }
        setProblems(fetchedProblems);
      }
    };

    fetchData();
  }, [userData]);

  
  return (
    <>
      {isLoading && <PageLoading />}
      {!isLoading && (
        <div className="bg-dark-layer-2 min-h-screen ">
          <Topbar clock={false} />
          <h1 className="text-2xl text-center text-gray-700 dark:text-gray-400 font-medium uppercase mt-10 mb-5">
            {headingText}
          </h1>

          <div className="relative overflow-x-auto mx-auto px-6 pb-10 bg-dark">
            <table className="text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto">
              <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b ">
                <tr>
                  <th scope="col" className="px-1 py-3 w-0 font-medium">
                    No.
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Difficulty
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Solution
                  </th>
                </tr>
              </thead>
              <tbody className="text-white ">
                {problems.map((doc, idx) => {
                  const difficultyColor =
                    doc.difficulty === "Easy"
                      ? "text-dark-green-s"
                      : doc.difficulty === "Medium"
                      ? "text-dark-yellow"
                      : "text-dark-pink";
                  const { number, strippedTitle } = stripNumber(doc.title);
                  return (
                    <tr
                      className={`${
                        idx % 2 === 1 ? "bg-dark-layer-1" : "bg-dark-layer-2"
                      }`}
                      key={doc.id}
                    >
                      <th className="px-2 py-4 font-medium whitespace-nowrap">
                        {number}
                      </th>
                      <td className="px-6 py-4">
                        <Link
                          href={`/problems/${doc.id}`}
                          className="hover:text-blue-400 cursor-pointer"
                        >
                          {strippedTitle}
                        </Link>
                      </td>
                      <td className={`px-6 py-4 ${difficultyColor}`}>
                        {doc.difficulty}
                      </td>
                      <td className={"px-6 py-4"}>{doc.topics}</td>
                      <td className="px-6 py-4">
                        <p className="text-gray-400">Coming soon</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default ProblemTable;
