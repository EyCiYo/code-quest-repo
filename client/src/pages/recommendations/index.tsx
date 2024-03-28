import Topbar from "@/components/Topbar/Topbar";

const RecommendationsPage: React.FC = () => {
  // List of embed URLs for videos
  const videoUrls = [
    "https://www.youtube.com/embed/KInG04mAjO0?si=BAjIMOnrBZQ027SO",
    "https://www.youtube.com/embed/nqXaPZi99JI?si=z2lCk57IAi5YLiVD",
    "https://www.youtube.com/embed/F8AbOfQwl1c?si=rq9roYkSfFvzkydm",
    "https://www.youtube.com/embed/-VgHk7UMPP4?si=KJd_1wjhPRhLRb6y",
    "https://www.youtube.com/embed/aPQY__2H3tE?si=PVZiPGzvsqOYnZ85",
    "https://www.youtube.com/embed/bC7o8P_Ste4?si=lgeu6-IM5MEbD9W8",
    "https://www.youtube.com/embed/fDKIpRe8GW4?si=Bnz5e1Vj47aWkKMS",
    "https://www.youtube.com/embed/knV86FlSXJ8?si=XdX8JOcisSwilq65"
  ];

  return (
    <div className="bg-dark-layer-2 min-h-screen">
      <Topbar clock={false}/>
      <div className="container mx-auto h-full py-8 ">
        <h1 className="text-3xl font-bold mb-4 text-white">
          Recommended Videos
        </h1>
        <div className="grid grid-cols-4 gap-6 mt-16">
          {videoUrls.map((url, index) => (
            <div
              key={index}
              className="bg-gray-500 p-2 rounded-lg shadow-lg m-6"
            >
              <div className="aspect-w-16 aspect-h-9">
                {/* Replace the video URL with the actual embed URL */}
                <iframe
                  width="100%"
                  height="100%"
                  src={url}
                  title={`Embedded Video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
