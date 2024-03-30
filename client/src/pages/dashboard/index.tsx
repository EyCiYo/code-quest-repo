import { useEffect, useState} from "react";
import Image from "next/image";
import Topbar from "@/components/Topbar/Topbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { UserStruct } from "@/utils/types";
import { getUserData } from "@/utils/userDataFetch";
import { useRouter } from "next/router";

import PerformanceChart from "@/components/PerformanceChart/PerformanceChart";

type DashboardProps = {};

const Dashboard: React.FC<DashboardProps> = () => {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [userData, setUserData] = useState<UserStruct | null>(null);
    useEffect(() => {
        if (user) {
            getUserData(user.uid).then((data) => {
                setUserData(data);
            }).catch((error) => {
                console.error('Error getting user data:', error);
            });
        }
        else {
            setUserData(null);
            router.push("/");
        }
    }, [user]);
    return (
        <>
            <Topbar clock={false} />
            <div className="bg-dark-layer-2 w-full h-full py-4 px-4 text-white min-w-[500px] ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-dark-layer-1 rounded-md py-4 px-4 min-w-[200px] md:min-w-[100px] max-h-[320px] md:max-h-full lg:min-w-[150] ">
                        <div className="flex items-center space-x-4 flex-1 justify-start p-4 gap-2">
                            <Image
                                src="/avatar.png"
                                alt="avatar"
                                height={150}
                                width={150}
                                className="rounded-full mr-7"
                            />
                            <div className="flex flex-col gap-4">
                                <div className="text-xl font-semibold">User Details</div>
                                <div>{userData?.name}</div>
                                <div>{userData?.email}</div>
                                <div>Date of Joining: {userData?.doj}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-dark-layer-1 rounded-md py-4 px-4 min-w-[200px] md:min-w-[100px] max-h-[320px] md:max-h-full lg:min-w-[150]">
                        <div className="text-xl font-semibold">Question Statistics</div>
                            <div className="grid grid-cols-2 grid-rows-3 grid-flow-row pt-3 px-4 text-lg">
                                <div className="text-green-600 p-2">Easy</div>
                                <div className="p-2">0</div>
                                <div className="text-orange-500 p-2">Medium</div>
                                <div className="p-2">1</div>
                                <div className="text-red-700 p-2">Hard</div>
                                <div className="p-2">1</div>
                            </div>
                        </div>
                        <div className="bg-dark-layer-1 rounded-md py-4 px-4 col-span-1 md:col-span-2 w-full">
                            <div className="text-xl font-semibold pb-2">Category Statistics</div>
                                <PerformanceChart userData={userData} />
                        </div>
                    </div>
                </div>
        </>
    );
};
export default Dashboard;
