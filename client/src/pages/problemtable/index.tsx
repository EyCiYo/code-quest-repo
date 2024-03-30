import { problems } from "@/questions/problems";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { FaFlagCheckered } from "react-icons/fa";
import { AiFillYoutube } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import YouTube from "react-youtube";
import Topbar from "@/components/Topbar/Topbar";
type ProblemTableProps = {};

const ProblemTable: React.FC<ProblemTableProps> = () => {
  const [youtubePlayer, setYoutubePlayer] = useState({
    isOpen: false,
    videoId: "",
  });

  const closeModal = () => {
    setYoutubePlayer({
      isOpen: false,
      videoId: "",
    });
  };
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key == "Escape") closeModal();
    };

    window.addEventListener("keydown", handleEscape);
  }, []);
  return (
    <main className="bg-dark-layer-2 min-h-screen ">
      <Topbar clock={false} />
      <h1 className="text-2xl text-center text-gray-700 dark:text-gray-400 font-medium uppercase mt-10 mb-5">
        LOOK AT THESE QUESTIONS
      </h1>

      <div className="relative overflow-x-auto mx-auto px-6 pb-10 bg-dark">
        <table className="text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto">
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b ">
            <tr>
              <th scope="col" className="px-1 py-3 w-0 font-medium">
                Status
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
                doc.difficulty == "Easy"
                  ? "text-dark-green-s"
                  : doc.difficulty == "Medium"
                  ? "text-dark-yellow"
                  : "text-dark-pink";
              return (
                <tr
                  className={`${
                    idx % 2 == 1 ? "bg-dark-layer-1" : "bg-dark-layer-2"
                  }`}
                  key={doc.id}
                >
                  <th className="px-2 py-4 font-medium text-dark-green-s whitespace-nowrap">
                    <FaFlagCheckered fontSize={"18"} width="18" />
                  </th>
                  <td className="px-6 py-4">
                    <Link
                      className="hover:text-blue-400 cursor-pointer"
                      href={`/problems/${doc.id}`}
                    >
                      {doc.title}
                    </Link>
                  </td>
                  <td className={`px-6 py-4 ${difficultyColor}`}>
                    {doc.difficulty}
                  </td>
                  <td className={"px-6 py-4"}>{doc.category}</td>
                  <td className="px-6 py-4">
                    {doc.videoId ? (
                      <AiFillYoutube
                        fontSize={"28"}
                        className="cursor-pointer hover:text-red-600"
                        onClick={() =>
                          setYoutubePlayer({
                            isOpen: true,
                            videoId: doc.videoId as string,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-400">Coming soon</p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* {youtubePlayer.isOpen && (
                <tfoot className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center ">
                    <div
                        className="bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute"
                        onClick={closeModal}
                    ></div>
                    <div className="w-full z-50 h-full px-6 relative max-w-4xl">
                        <div className="w-full h-full flex items-center justify-center relative">
                            <div className="w-full relative">
                                <IoClose
                                    fontSize={"35"}
                                    className="cursor-pointer absolute -top-16 right-0"
                                    onClick={closeModal}
                                />
                                <YouTube
                                    videoId={youtubePlayer.videoId}
                                    loading="lazy"
                                    iframeClassName="w-full min-h-[500px]"
                                />
                            </div>
                        </div>
                    </div>
                </tfoot>
            )} */}
    </main>
  );
};
export default ProblemTable;
