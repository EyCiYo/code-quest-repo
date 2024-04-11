import React, { useEffect, useState } from "react";
import Topbar from "@/components/Topbar/Topbar";
import { getRecommendVideos, convertToScoresObject } from "../../../model";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUserData } from "@/utils/userDataFetch";
import { auth } from "@/firebase/firebase";
import { UserStruct } from "@/utils/types";

const RecommendationsPage: React.FC = () => {
  const [recommendedVideos, setRecommendedVideos] = useState<
    { url: string; title: string }[]
  >([]);
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<UserStruct | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (error) {
          console.error("Error getting user data:", error);
        }
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (!userData) return;
    const scoresArray = convertToScoresObject(userData.scores) || [];
    const recommendations = getRecommendVideos(scoresArray) as Object;
    console.log("Topic and No. of Questions recommended");
    for (let key in recommendations) {
      console.log(key, recommendations[key]);
    }
    // Define dummy URLs and titles for each topic
    const dummyUrlsAndQuestions: {
      [key: string]: { url: string; title: string }[];
    } = {
      array: [
        {
          url: "https://www.youtube.com/embed/1",
          title: "title for array 1",
        },
        {
          url: "https://www.youtube.com/embed/2",
          title: "title for array 2",
        },
        {
          url: "https://www.youtube.com/embed/3",
          title: "title for array 3",
        },
        {
          url: "https://www.youtube.com/embed/4",
          title: "title for array 4",
        },
        {
          url: "https://www.youtube.com/embed/5",
          title: "title for array 5",
        },
        {
          url: "https://www.youtube.com/embed/6",
          title: "title for array 6",
        },
      ],
      "hash table": [
        {
          url: "https://www.youtube.com/embed/7",
          title: "title for hash table 1",
        },
        {
          url: "https://www.youtube.com/embed/8",
          title: "title for hash table 2",
        },
        {
          url: "https://www.youtube.com/embed/9",
          title: "title for hash table 3",
        },
        {
          url: "https://www.youtube.com/embed/10",
          title: "title for hash table 4",
        },
        {
          url: "https://www.youtube.com/embed/11",
          title: "title for hash table 5",
        },
        {
          url: "https://www.youtube.com/embed/12",
          title: "title for hash table 6",
        },
      ],
      "binary search": [
        {
          url: "https://www.youtube.com/embed/13",
          title: "title for binary search 1",
        },
        {
          url: "https://www.youtube.com/embed/14",
          title: "title for binary search 2",
        },
        {
          url: "https://www.youtube.com/embed/15",
          title: "title for binary search 3",
        },
        {
          url: "https://www.youtube.com/embed/16",
          title: "title for binary search 4",
        },
        {
          url: "https://www.youtube.com/embed/17",
          title: "title for binary search 5",
        },
        {
          url: "https://www.youtube.com/embed/18",
          title: "title for binary search 6",
        },
      ],
      "dynamic programming": [
        {
          url: "https://www.youtube.com/embed/19",
          title: "title for dynamic programming 1",
        },
        {
          url: "https://www.youtube.com/embed/20",
          title: "title for dynamic programming 2",
        },
        {
          url: "https://www.youtube.com/embed/21",
          title: "title for dynamic programming 3",
        },
        {
          url: "https://www.youtube.com/embed/22",
          title: "title for dynamic programming 4",
        },
        {
          url: "https://www.youtube.com/embed/23",
          title: "title for dynamic programming 5",
        },
        {
          url: "https://www.youtube.com/embed/24",
          title: "title for dynamic programming 6",
        },
      ],
      math: [
        {
          url: "https://www.youtube.com/embed/25",
          title: "title for math 1",
        },
        {
          url: "https://www.youtube.com/embed/26",
          title: "title for math 2",
        },
        {
          url: "https://www.youtube.com/embed/27",
          title: "title for math 3",
        },
        {
          url: "https://www.youtube.com/embed/28",
          title: "title for math 4",
        },
        {
          url: "https://www.youtube.com/embed/29",
          title: "title for math 5",
        },
        {
          url: "https://www.youtube.com/embed/30",
          title: "title for math 6",
        },
      ],
      string: [
        {
          url: "https://www.youtube.com/embed/25",
          title: "title for string 1",
        },
        {
          url: "https://www.youtube.com/embed/26",
          title: "title for string 2",
        },
        {
          url: "https://www.youtube.com/embed/27",
          title: "title for string 3",
        },
        {
          url: "https://www.youtube.com/embed/28",
          title: "title for string 4",
        },
        {
          url: "https://www.youtube.com/embed/29",
          title: "title for string 5",
        },
        {
          url: "https://www.youtube.com/embed/30",
          title: "title for string 6",
        },
      ],
    };

    const recommendedVideos: { url: string; title: string }[] = [];

    for (let key in recommendations) {
      const recommendedCount = recommendations[key] || 0; // Ensure score is defined
      const topicsUrlsAndQuestions = dummyUrlsAndQuestions[key]; // Get URLs and titles for the current topic
      if (!topicsUrlsAndQuestions || recommendedCount <= 0) continue; // If no URLs or score is 0, continue

      const videosForTopic = topicsUrlsAndQuestions.slice(0, recommendedCount); // Get recommended videos for the topic
      recommendedVideos.push(...videosForTopic); // Add recommended videos to the list
    }

    setRecommendedVideos(recommendedVideos);
  }, [userData]);

  return (
    <div className="bg-dark-layer-2 min-h-screen">
      <Topbar clock={false} />
      <div className="container mx-auto h-full py-8 ">
        <h1 className="text-3xl font-bold mb-4 text-white">
          Recommended Videos
        </h1>
        <div className="grid grid-cols-4 gap-6 mt-16">
          {recommendedVideos.map((video, index) => (
            <div
              key={index}
              className="bg-gray-500 p-2 rounded-lg shadow-lg m-6"
            >
              <div className="aspect-w-16 aspect-h-9">
                {/* Replace the video URL with the actual embed URL */}
                <iframe
                  width="100%"
                  height="100%"
                  src={video.url}
                  title={`Embedded Video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div>{video.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
