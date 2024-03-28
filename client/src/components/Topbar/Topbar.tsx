import Link from "next/link";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import Logout from "../Buttons/Logout";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtoms";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import Timer from "../Timer/Timer";

type TopbarProps = {
    problemPage?: boolean;
    clock?: boolean;
};

const Topbar: React.FC<TopbarProps> = ({ problemPage, clock = true }) => {
    const [user] = useAuthState(auth);
    const setAuthModalState = useSetRecoilState(authModalState);
    return (
        <nav className="relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7">
            <div
                className={`flex w-full items-center justify-between ${
                    !problemPage ? "max-w-[1200px] mx-auto" : ""
                }`}
            >
                <Link href="/" className="h-[22px] flex-1">
                    <Image src="/logo.png" alt="logo" height={50} width={50} />
                </Link>

                {problemPage && (
                    <div className="flex items-center gap-4 flex-1 justify-center">
                        <div className="flex items-center justify-center rounded bg-dark-fill-3 h-8 w-8 hover:bg-dark-fill-2 cursor-pointer">
                            <FaChevronLeft />
                        </div>
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-medium max-w-[170] text-dark-gray-8 cursor-pointer"
                        >
                            <div>
                                <BsList />
                            </div>
                            <p>Problems List</p>
                        </Link>
                        <div className="flex items-center justify-center rounded bg-dark-fill-3 h-8 w-8 hover:bg-dark-fill-2 cursor-pointer">
                            <FaChevronRight />
                        </div>
                    </div>
                )}

                <div className="flex items-center space-x-4 flex-1 justify-end">
                    {clock ? <Timer /> : null}
                    {/* {!user && (
                        <Link
                            href="/auth"
                            onClick={() => {
                                setAuthModalState((prev) => ({
                                    ...prev,
                                    isOpen: true,
                                    type: "login",
                                }));
                            }}
                        >
                            <button className="bg-dark-fill-3 py-1 px-2 cursor-pointer rounded ">
                                Sign In
                            </button>
                        </Link>
                    )} */}
                    {user && (
                        <div className="cursor-pointer group relative">
                            <Link href="/dashboard">
                                <img
                                    src="/avatar.png"
                                    alt="userimg"
                                    className="h-8 w-8 rounded-full"
                                />
                            </Link>
                            <div
                                className="absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg z-40 group-hover:scale-90 scale-0 
		transition-all duration-300 ease-in-out"
                            >
                                <p className="text-sm">{user.email}</p>
                            </div>
                        </div>
                    )}
                    {user && <Logout />}
                </div>
            </div>
        </nav>
    );
};
export default Topbar;
